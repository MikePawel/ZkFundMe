// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IWorldID {
	/// @notice Reverts if the zero-knowledge proof is invalid.
	/// @param root The of the Merkle tree
	/// @param groupId The id of the Semaphore group
	/// @param signalHash A keccak256 hash of the Semaphore signal
	/// @param nullifierHash The nullifier hash
	/// @param externalNullifierHash A keccak256 hash of the external nullifier
	/// @param proof The zero-knowledge proof
	/// @dev  Note that a double-signaling check is not included here, and should be carried by the caller.
	function verifyProof(
		uint256 root,
		uint256 groupId,
		uint256 signalHash,
		uint256 nullifierHash,
		uint256 externalNullifierHash,
		uint256[8] calldata proof
	) external view;
}

library ByteHasher {
	/// @dev Creates a keccak256 hash of a bytestring.
	/// @param value The bytestring to hash
	/// @return The hash of the specified value
	/// @dev `>> 8` makes sure that the result is included in our field
	function hashToField(bytes memory value) internal pure returns (uint256) {
		return uint256(keccak256(abi.encodePacked(value))) >> 8;
	}
}

contract Campaign {
    struct CampaignData {
        uint id;
        address creator;
        string title;
        string description;
        string wallet;
        string ipfs;
        uint money;
    }

    address public owner;

    uint256 private count;

    uint public campaignCount = 0;
    mapping(uint => CampaignData) public campaigns;

     constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
    }
   function verifyAndExcute() public returns(bool) {
     count += 1;
     return true;
   }

     modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }
    
    function createCampaign(string memory _title, string memory _description, string memory _wallet, string memory _ipfs, uint _money) public returns(uint) {
        campaignCount ++;
        campaigns[campaignCount] = CampaignData(campaignCount, msg.sender, _title, _description, _wallet, _ipfs, _money);
        
        return campaignCount;
    }
    
    function getCampaign(uint _campaignId) public view returns (uint, address, string memory, string memory, string memory, string memory, uint) {
        CampaignData memory campaign = campaigns[_campaignId];
        return (campaign.id, campaign.creator, campaign.title, campaign.description, campaign.wallet, campaign.ipfs, campaign.money);
    }

     function updateAmount(uint _campaignId, uint _amount) public onlyOwner {
        campaigns[_campaignId].money += _amount;
    }



    function balance(uint _campaignId) public view returns(uint) {
             CampaignData memory campaign = campaigns[_campaignId];
             return campaign.money;
    }

    using ByteHasher for bytes;

	///////////////////////////////////////////////////////////////////////////////
	///                                  ERRORS                                ///
	//////////////////////////////////////////////////////////////////////////////

	/// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

	/// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal  worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal  externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal  groupId = 1;

	/// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
	mapping(uint256 => bool) internal nullifierHashes;

	/// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	/// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
	function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public  {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

		// We now verify the provided proof is valid and the user is verified by World ID
  
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);

		

		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		nullifierHashes[nullifierHash] = true;

		// Finally, execute your logic here, for example issue a token, NFT, etc...
		// Make sure to emit some kind of event afterwards!

        //Autheentication verified In other case revert transaction
	}
}
