// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PortfolioRegistry
/// @notice On-chain guestbook + skill endorsements for a personal portfolio site.
/// @dev Deploy to Base Sepolia (testnet, chainId 84532) first, then Base Mainnet (8453).
contract PortfolioRegistry {
    struct Entry {
        address sender;
        string message;
        uint256 timestamp;
        uint256 tipAmount;
    }

    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    Entry[] private _entries;

    /// @notice One endorsement per wallet per skill.
    mapping(address => mapping(string => bool)) public hasEndorsed;
    /// @notice Total endorsements received per skill name.
    mapping(string => uint256) public endorsementCount;

    event NewGuestbookEntry(
        address indexed sender,
        string message,
        uint256 timestamp,
        uint256 tipAmount
    );

    event SkillEndorsed(address indexed endorser, string skillName, uint256 newCount);

    /// @notice Leave a guestbook message, optionally with an ETH tip ("buy me a coffee").
    /// @param _message Message text, max 280 characters (bytes).
    function signGuestbook(string calldata _message) external payable {
        require(bytes(_message).length > 0, "Message must not be empty");
        require(
            bytes(_message).length <= MAX_MESSAGE_LENGTH,
            "Message exceeds 280 characters"
        );

        _entries.push(
            Entry({
                sender: msg.sender,
                message: _message,
                timestamp: block.timestamp,
                tipAmount: msg.value
            })
        );

        emit NewGuestbookEntry(msg.sender, _message, block.timestamp, msg.value);
    }

    /// @notice Endorse one of the owner's skills. One endorsement per wallet per skill.
    function endorseSkill(string calldata _skillName) external {
        require(bytes(_skillName).length > 0, "Skill name must not be empty");
        require(!hasEndorsed[msg.sender][_skillName], "Already endorsed this skill");

        hasEndorsed[msg.sender][_skillName] = true;
        endorsementCount[_skillName] += 1;

        emit SkillEndorsed(msg.sender, _skillName, endorsementCount[_skillName]);
    }

    /// @notice Return all guestbook entries (newest last).
    function getGuestbookEntries() external view returns (Entry[] memory) {
        return _entries;
    }

    /// @notice Number of guestbook entries stored.
    function getGuestbookCount() external view returns (uint256) {
        return _entries.length;
    }

    /// @notice Withdraw accumulated tips. Only callable by the contract deployer (owner).
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function withdrawTips() external {
        require(msg.sender == owner, "Not the owner");
        (bool ok, ) = payable(owner).call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }
}
