// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

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

    uint public campaignCount = 0;
    mapping(uint => CampaignData) public campaigns;

     constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
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

    function updateAmount(uint _campaignId, uint _amount) public view onlyOwner {
             CampaignData memory campaign = campaigns[_campaignId];
             campaign.money += _amount;
    }

    

    function balance(uint _campaignId) public view returns(uint) {
             CampaignData memory campaign = campaigns[_campaignId];
             return campaign.money;
    }
}
