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

    uint public campaignCount = 0;
    mapping(uint => CampaignData) public campaigns;
    
    function createCampaign(string memory _title, string memory _description, string memory _wallet, string memory _ipfs, uint _money) public returns(uint) {
        campaignCount ++;
        campaigns[campaignCount] = CampaignData(campaignCount, msg.sender, _title, _description, _wallet, _ipfs, _money);
        
        return campaignCount;
    }
    
    function getCampaign(uint _campaignId) public view returns (uint, address, string memory, string memory, string memory, string memory, uint) {
        CampaignData memory campaign = campaigns[_campaignId];
        return (campaign.id, campaign.creator, campaign.title, campaign.description, campaign.wallet, campaign.ipfs, campaign.money);
    }
}
