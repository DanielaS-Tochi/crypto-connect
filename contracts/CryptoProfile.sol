// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptoProfile {
    struct Profile {
        string username;
        string[] favoriteCryptos;
    }

    mapping(address => Profile) private profiles;

    event ProfileCreated(address indexed user, string username);
    event CryptoAdded(address indexed user, string crypto);

    function createProfile(string calldata _username) external {
        profiles[msg.sender].username = _username;
        emit ProfileCreated(msg.sender, _username);
    }

    function addFavoriteCrypto(string calldata _crypto) external {
        profiles[msg.sender].favoriteCryptos.push(_crypto);
        emit CryptoAdded(msg.sender, _crypto);
    }

    function getProfile(address _user) external view returns (string memory, string[] memory) {
        Profile storage profile = profiles[_user];
        return (profile.username, profile.favoriteCryptos);
    }
}
