// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoProfile {
    struct UserProfile {
        string name;
        string[] favoriteCryptos;
    }

    mapping(address => UserProfile) private users;

    event ProfileCreated(address indexed user, string username);
    event CryptoAdded(address indexed user, string crypto);
    event CryptoRemoved(address indexed user, string crypto); // 👈 Nuevo evento

    function createProfile(string memory _name) public {
        require(bytes(users[msg.sender].name).length == 0, "Profile already exists");
        users[msg.sender].name = _name;
        emit ProfileCreated(msg.sender, _name);
    }

    function addFavoriteCrypto(string memory _crypto) public {
        require(bytes(users[msg.sender].name).length > 0, "Profile does not exist");

        string[] storage favs = users[msg.sender].favoriteCryptos;
        for (uint i = 0; i < favs.length; i++) {
            require(keccak256(bytes(favs[i])) != keccak256(bytes(_crypto)), "Crypto already added");
        }

        favs.push(_crypto);
        emit CryptoAdded(msg.sender, _crypto);
    }

    function removeFavoriteCrypto(string memory _crypto) public {
        require(bytes(users[msg.sender].name).length > 0, "Profile does not exist");

        string[] storage favs = users[msg.sender].favoriteCryptos;
        bool found = false;

        for (uint i = 0; i < favs.length; i++) {
            if (keccak256(bytes(favs[i])) == keccak256(bytes(_crypto))) {
                favs[i] = favs[favs.length - 1]; // reemplaza con la última
                favs.pop(); // elimina la última
                found = true;
                break;
            }
        }

        require(found, "Crypto not found in favorites");
        emit CryptoRemoved(msg.sender, _crypto); // 👈 Emitimos evento
    }

    function getProfile(address _user) public view returns (string memory, string[] memory) {
        UserProfile storage profile = users[_user];
        return (profile.name, profile.favoriteCryptos);
    }
}
// 👆 Aquí hemos añadido un nuevo evento CryptoRemoved para notificar cuando se elimina una criptomoneda favorita.