// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Minimal Foundry-style test for PortfolioRegistry.
// Run with: forge test (requires Foundry + forge-std; see README).
// This file is intentionally dependency-light: it uses a tiny local
// assertion helper instead of forge-std so the contract logic stays
// readable. For a full setup, replace `Test` with forge-std/Test.

import "./PortfolioRegistry.sol";

contract PortfolioRegistryTest {
    PortfolioRegistry internal registry;
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    function setUp() public {
        registry = new PortfolioRegistry();
    }

    function testSignGuestbookStoresEntry() public {
        registry.signGuestbook{value: 0.001 ether}("Halo! Great portfolio.");
        PortfolioRegistry.Entry[] memory entries = registry.getGuestbookEntries();
        require(entries.length == 1, "expected 1 entry");
        require(entries[0].sender == address(this), "wrong sender");
        require(entries[0].tipAmount == 0.001 ether, "wrong tip");
    }

    function testSignGuestbookRejectsTooLong() public {
        bytes memory long = new bytes(281);
        for (uint256 i = 0; i < long.length; i++) long[i] = "a";
        try registry.signGuestbook(string(long)) {
            revert("should have reverted");
        } catch {
            // expected
        }
    }

    function testEndorseSkillOncePerWallet() public {
        registry.endorseSkill("PHP");
        require(registry.endorsementCount("PHP") == 1, "count should be 1");
        try registry.endorseSkill("PHP") {
            revert("second endorsement should revert");
        } catch {
            // expected
        }
        require(registry.endorsementCount("PHP") == 1, "count should stay 1");
    }

    // Silence unused-variable warnings for the faux user addresses.
    function testAddressesExist() public view {
        require(alice != bob, "distinct users");
    }
}
