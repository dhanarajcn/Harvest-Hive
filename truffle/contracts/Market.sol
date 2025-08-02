// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Market {
    struct User {
        address userAddr;
        string userName;
        string userEmail;
        string userAddress;
        string userPhone;
        string userType;
    }

    struct Product {
        uint256 productId;
        address ownerAddress;
        string productName;
        string productDescription;
        string productCategory;
        string productImage;
        uint256 productPrice;
        uint256 minQuantity;
        uint256 maxQuantity;
        uint256 totalQuantity;
    }

    struct Negotiation {
        uint256 negotiationId;
        uint256 productId;
        address buyerAddress;
        address sellerAddress;
        uint256 quantity;
        uint256 totalPrice;
        bool isAccepted;
        bool isRejected;
    }

    struct Purchase {
        uint256 purchaseId;
        Product product;
        address buyerAddress;
        uint256 quantity;
        uint256 totalPrice;
        int256 accessoriesId1;
        int256 accessoriesId2;
        int256 accessoriesId3;
    }

    struct AddAccessories {
        uint256 accessoriesId;
        string accessoriesName;
        uint256 accessoriesPricePerKg;
        address ownerAddress;
    }

    struct Call {
        address requester;
        address requestee;
        string roomId;
        string description;
        string dateTime;
    }

    uint256 userCount;
    mapping(uint256 => User) public users;
    uint256 productCount;
    mapping(uint256 => Product) public products;
    uint256 purchaseCount;
    mapping(uint256 => Purchase) public purchases;
    uint256 negotiationCount;
    mapping(uint256 => Negotiation) public negotiations;
    uint256 accessoriesCount;
    mapping(uint256 => AddAccessories) public accessories;
    uint256 callCount;
    mapping(uint256 => Call) public calls;

    constructor() {
        userCount = 0;
        productCount = 0;
        purchaseCount = 0;
        negotiationCount = 0;
        accessoriesCount = 0;
        callCount = 0;
    }

    function addUser(
        string memory _userName,
        string memory _userEmail,
        string memory _userAddress,
        string memory _userPhone,
        string memory _userType
    ) public {
        User memory newUser = User(
            msg.sender,
            _userName,
            _userEmail,
            _userAddress,
            _userPhone,
            _userType
        );
        users[userCount] = newUser;
        userCount++;
    }

    function getUser(address userAddress) public view returns (User memory) {
        for (uint256 i = 0; i < userCount; i++) {
            if (users[i].userAddr == userAddress) {
                return users[i];
            }
        }
        return User(address(0), "", "", "", "", "");
    }

    function getMyDetails() public view returns (User memory) {
        for (uint256 i = 0; i < userCount; i++) {
            if (users[i].userAddr == msg.sender) {
                return users[i];
            }
        }
        return User(address(0), "", "", "", "", "");
    }

    function addProduct(
        string memory _productName,
        string memory _productDescription,
        string memory _productCategory,
        string memory _productImage,
        uint256 _productPrice,
        uint256 _minQuantity,
        uint256 _maxQuantity,
        uint256 _totalQuantity
    ) public {
        Product memory newProduct = Product(
            productCount,
            msg.sender,
            _productName,
            _productDescription,
            _productCategory,
            _productImage,
            _productPrice,
            _minQuantity,
            _maxQuantity,
            _totalQuantity
        );
        products[productCount] = newProduct;
        productCount++;
    }

    function getProducts() public view returns (Product[] memory) {
        Product[] memory _products = new Product[](productCount);
        for (uint256 i = 0; i < productCount; i++) {
            _products[i] = products[i];
        }
        return _products;
    }

    function getMyProducts() public view returns (Product[] memory) {
        uint256 totalMyProducts = 0;
        for (uint256 i = 0; i < productCount; i++) {
            if (products[i].ownerAddress == msg.sender) {
                totalMyProducts++;
            }
        }

        Product[] memory _products = new Product[](totalMyProducts);
        for (uint256 i = 0; i < productCount; i++) {
            if (products[i].ownerAddress == msg.sender) {
                _products[i] = products[i];
            }
        }
        return _products;
    }

    function addNegotiation(
        uint256 _productId,
        uint256 _quantity,
        uint256 _price
    ) public {
        negotiations[negotiationCount] = Negotiation(
            negotiationCount,
            _productId,
            msg.sender,
            products[_productId].ownerAddress,
            _quantity,
            _price,
            false,
            false
        );
        negotiationCount++;
    }

    function getNegotiations() public view returns (Negotiation[] memory) {
        uint256 totalNegotiations = 0;
        for (uint256 i = 0; i < negotiationCount; i++) {
            if (
                negotiations[i].buyerAddress == msg.sender ||
                negotiations[i].sellerAddress == msg.sender
            ) {
                totalNegotiations++;
            }
        }

        Negotiation[] memory _negotiations = new Negotiation[](
            totalNegotiations
        );
        uint256 j = 0;
        for (uint256 i = 0; i < negotiationCount; i++) {
            if (
                negotiations[i].buyerAddress == msg.sender ||
                negotiations[i].sellerAddress == msg.sender
            ) {
                _negotiations[j++] = negotiations[i];
            }
        }
        return _negotiations;
    }

    function acceptNegotiation(uint256 _negotiationId) public {
        Negotiation storage negotiation = negotiations[_negotiationId];
        require(negotiation.sellerAddress == msg.sender, "Not authorized");
        require(negotiation.isAccepted == false, "Already accepted");
        require(negotiation.isRejected == false, "Already rejected");
        negotiation.isAccepted = true;
    }

    function rejectNegotiation(uint256 _negotiationId) public {
        Negotiation storage negotiation = negotiations[_negotiationId];
        require(negotiation.sellerAddress == msg.sender, "Not authorized");
        require(negotiation.isAccepted == false, "Already accepted");
        require(negotiation.isRejected == false, "Already rejected");
        negotiation.isRejected = true;
    }

    function addAccessories(
        string memory _accessoriesName,
        uint256 _accessoriesPricePerKg
    ) public {
        AddAccessories memory newAccessories = AddAccessories(
            accessoriesCount,
            _accessoriesName,
            _accessoriesPricePerKg,
            msg.sender
        );
        accessories[accessoriesCount] = newAccessories;
        accessoriesCount++;
    }

    function getAccessories() public view returns (AddAccessories[] memory) {
        AddAccessories[] memory _accessories = new AddAccessories[](
            accessoriesCount
        );
        for (uint256 i = 0; i < accessoriesCount; i++) {
            _accessories[i] = accessories[i];
        }
        return _accessories;
    }

    function purchaseProduct(
        uint256 _productId,
        uint256 _quantity,
        int _accessoriesId1,
        int _accessoriesId2,
        int _accessoriesId3
    ) public payable {
        Product storage product = products[_productId];
        require(product.totalQuantity >= _quantity, "Not enough quantity");
        require(
            product.minQuantity <= _quantity,
            "Quantity is less than minimum"
        );
        require(
            product.maxQuantity >= _quantity,
            "Quantity is more than maximum"
        );
        // require(
        //     msg.value == product.productPrice * _quantity,
        //     "Insufficient funds"
        // );

        // transfer that amount to the owner
        payable(product.ownerAddress).transfer(msg.value);
        product.totalQuantity -= _quantity;
        Purchase memory newPurchase = Purchase(
            purchaseCount,
            product,
            msg.sender,
            _quantity,
            msg.value,
            _accessoriesId1,
            _accessoriesId2,
            _accessoriesId3
        );
        purchases[purchaseCount] = newPurchase;
        purchaseCount++;
    }

    function getAllMyAccessorySales() public view returns (Purchase[] memory) {
        uint256 totalMyAccessorySales = 0;
        for (uint256 i = 0; i < purchaseCount; i++) {
            if (
                (purchases[i].accessoriesId1 != -1 &&
                    accessories[uint(purchases[i].accessoriesId1)]
                        .ownerAddress ==
                    msg.sender) ||
                (purchases[i].accessoriesId2 != -1 &&
                    accessories[uint(purchases[i].accessoriesId2)]
                        .ownerAddress ==
                    msg.sender) ||
                (purchases[i].accessoriesId3 != -1 &&
                    accessories[uint(purchases[i].accessoriesId3)]
                        .ownerAddress ==
                    msg.sender)
            ) {
                totalMyAccessorySales++;
            }
        }

        Purchase[] memory _purchases = new Purchase[](totalMyAccessorySales);
        uint256 j = 0;
        for (uint256 i = 0; i < purchaseCount; i++) {
            if (
                (purchases[i].accessoriesId1 != -1 &&
                    accessories[uint(purchases[i].accessoriesId1)]
                        .ownerAddress ==
                    msg.sender) ||
                (purchases[i].accessoriesId2 != -1 &&
                    accessories[uint(purchases[i].accessoriesId2)]
                        .ownerAddress ==
                    msg.sender) ||
                (purchases[i].accessoriesId3 != -1 &&
                    accessories[uint(purchases[i].accessoriesId3)]
                        .ownerAddress ==
                    msg.sender)
            ) {
                _purchases[j++] = purchases[i];
            }
        }
        return _purchases;
    }

    function getMyPurchases() public view returns (Purchase[] memory) {
        uint256 totalMyPurchases = 0;
        for (uint256 i = 0; i < purchaseCount; i++) {
            if (purchases[i].buyerAddress == msg.sender) {
                totalMyPurchases++;
            }
        }

        Purchase[] memory _purchases = new Purchase[](totalMyPurchases);
        uint256 j = 0;
        for (uint256 i = 0; i < purchaseCount; i++) {
            if (purchases[i].buyerAddress == msg.sender) {
                _purchases[j++] = purchases[i];
            }
        }
        return _purchases;
    }

    function getMySales() public view returns (Purchase[] memory) {
        uint256 totalMySales = 0;
        for (uint256 i = 0; i < purchaseCount; i++) {
            if (purchases[i].product.ownerAddress == msg.sender) {
                totalMySales++;
            }
        }

        Purchase[] memory _purchases = new Purchase[](totalMySales);
        uint256 j = 0;
        for (uint256 i = 0; i < purchaseCount; i++) {
            if (purchases[i].product.ownerAddress == msg.sender) {
                _purchases[j++] = purchases[i];
            }
        }
        return _purchases;
    }

    function addCall(
        address _requestee,
        string memory _roomId,
        string memory _description,
        string memory _dateTime
    ) public {
        calls[callCount++] = Call(
            msg.sender,
            _requestee,
            _roomId,
            _description,
            _dateTime
        );
    }

    function getAllMyCalls() public view returns (Call[] memory) {
        uint256 getAllMyCallsNo = 0;
        for (uint256 i = 0; i < callCount; i++) {
            if (
                calls[i].requester == msg.sender ||
                calls[i].requestee == msg.sender
            ) {
                getAllMyCallsNo++;
            }
        }

        Call[] memory _calls = new Call[](getAllMyCallsNo);
        uint256 j = 0;
        for (uint256 i = 0; i < callCount; i++) {
            if (
                calls[i].requester == msg.sender ||
                calls[i].requestee == msg.sender
            ) {
                _calls[j++] = calls[i];
            }
        }
        return _calls;
    }
}
