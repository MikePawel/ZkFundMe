// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IZkBobDirectDeposits {
    enum DirectDepositStatus {
        Missing, // requested deposit does not exist
        Pending, // requested deposit was submitted and is pending in the queue
        Completed, // requested deposit was successfully processed
        Refunded // requested deposit was refunded to the fallback receiver
    }

    struct DirectDeposit {
        address fallbackReceiver; // refund receiver for deposits that cannot be processed
        uint96 sent; // sent amount in BOB tokens (18 decimals)
        uint64 deposit; // deposit amount, after subtracting all fees (9 decimals)
        uint64 fee; // deposit fee (9 decimals)
        uint40 timestamp; // deposit submission timestamp
        DirectDepositStatus status; // deposit status
        bytes10 diversifier; // receiver zk address, part 1/2
        bytes32 pk; // receiver zk address, part 2/2
    }

    /**
     * @notice Retrieves the direct deposits from the queue by its id.
     * @param depositId id of the submitted deposit.
     * @return deposit recorded deposit struct
     */
    function getDirectDeposit(uint256 depositId) external view returns (DirectDeposit memory deposit);

    /**
     * @notice Performs a direct deposit to the specified zk address.
     * In case the deposit cannot be processed, it can be refunded later to the fallbackReceiver address.
     * @param fallbackReceiver receiver of deposit refund.
     * @param amount direct deposit amount.
     * @param zkAddress receiver zk address.
     * @return depositId id of the submitted deposit to query status for.
     */
    function directDeposit(
        address fallbackReceiver,
        uint256 amount,
        bytes memory zkAddress
    )
        external
        returns (uint256 depositId);

    /**
     * @notice Performs a direct deposit to the specified zk address.
     * In case the deposit cannot be processed, it can be refunded later to the fallbackReceiver address.
     * @param fallbackReceiver receiver of deposit refund.
     * @param amount direct deposit amount.
     * @param zkAddress receiver zk address.
     * @return depositId id of the submitted deposit to query status for.
     */
    function directDeposit(
        address fallbackReceiver,
        uint256 amount,
        string memory zkAddress
    )
        external
        returns (uint256 depositId);

    /**
     * @notice ERC677 callback for performing a direct deposit.
     * Do not call this function directly, it's only intended to be called by the token contract.
     * @param from original tokens sender.
     * @param amount direct deposit amount.
     * @param data encoded address pair - abi.encode(address(fallbackReceiver), bytes(zkAddress))
     * @return ok true, if deposit of submitted successfully.
     */
    function onTokenTransfer(address from, uint256 amount, bytes memory data) external returns (bool ok);

    /**
     * @notice Tells the direct deposit fee, in zkBOB units (9 decimals).
     * @return fee direct deposit submission fee.
     */
    function directDepositFee() external view returns (uint64 fee);

    /**
     * @notice Tells the timeout after which unprocessed direct deposits can be refunded.
     * @return timeout duration in seconds.
     */
    function directDepositTimeout() external view returns (uint40 timeout);

    /**
     * @notice Tells the nonce of next direct deposit.
     * @return nonce direct deposit nonce.
     */
    function directDepositNonce() external view returns (uint32 nonce);

    /**
     * @notice Refunds specified direct deposit.
     * Can be called by anyone, but only after the configured timeout has passed.
     * Function will revert for deposit that is not pending.
     * @param index deposit id to issue a refund for.
     */
    function refundDirectDeposit(uint256 index) external;

    /**
     * @notice Refunds multiple direct deposits.
     * Can be called by anyone, but only after the configured timeout has passed.
     * Function will do nothing for non-pending deposits and will not revert.
     * @param indices deposit ids to issue a refund for.
     */
    function refundDirectDeposit(uint256[] memory indices) external;
}

interface IERC677 {
    function transferAndCall(address to, uint256 amount, bytes calldata data) external;
}

contract DirectDeposit {


    //Polygon
    IERC677 public bob = IERC677(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);
    IERC20 bobi = IERC20(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);
    IZkBobDirectDeposits queue = IZkBobDirectDeposits(0x668c5286eAD26fAC5fa944887F9D2F20f7DDF289);

    //IERC677 public bob = IERC677(0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f);
    //IERC20 bobi = IERC20(0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f);
    //IZkBobDirectDeposits queue = IZkBobDirectDeposits(0xE3Dd183ffa70BcFC442A0B9991E682cA8A442Ade);


    using SafeERC20 for IERC20;


address public fallbackReceiver;

address public owner;

  constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
        fallbackReceiver = msg.sender;
    }

modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    //Some basic events to help us track the deposit and withdrawal of BOB tokens
    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed sender, uint256 amount);
    event Received(address, uint256);

function directDeposit(
        uint256 _amount,
        string calldata _zkAddress
    )
        external
    {
     directDeposit(msg.sender, _amount, bytes(_zkAddress));
    }

    function directDeposit(
        address _fallbackUser,
        uint256 _amount,
        bytes memory _rawZkAddress
    )
        private
    {
        bobi.safeTransferFrom(msg.sender, address(this), _amount);
        directDeposit(_amount, _rawZkAddress);
    }

    function directDeposit(uint256 amount, bytes memory zkRecieverAddress) private {
 
        bob.transferAndCall(address(queue), amount, abi.encode(fallbackReceiver, zkRecieverAddress));

    }

    function tryPool(uint256 _amount, string memory _address) public {

     bytes memory zkAddress = bytes(_address);
        
     bobi.approve(address(queue), _amount);
     bobi.safeTransferFrom(msg.sender, address(this), _amount);
     uint256 depositId = queue.directDeposit(fallbackReceiver, _amount, zkAddress);
    }

     function tryPool2(uint256 _amount, string memory _address) public {

     bytes memory zkAddress = bytes(_address);  
     bobi.safeTransferFrom(msg.sender, address(this), _amount);
     
     bob.transferAndCall(address(queue), _amount, abi.encode(fallbackReceiver, zkAddress));
    }
}