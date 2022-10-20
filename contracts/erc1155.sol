pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract tokens is ERC1155 {
    uint256[] supplies = [1, 1, 1, 1, 1, 100, 100, 100, 100, 100];
    mapping(uint256 => uint256) public price;
    address immutable i_owner;
    event newToken(uint256 ID, uint256 amount, uint price);

    constructor() ERC1155("xyz.com") {
        i_owner = msg.sender;
        price[1] = price[2] = price[3] = 1;
        price[4] = price[5] = 2;
        price[6] = price[7] = price[8] = 1;
        price[9] = price[10] = 2;
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner);
        _;
    }

    function showSupply(uint256 _id) external view returns (uint256) {
        return supplies[_id - 1];
    }

    function balance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function totalTypes() external view returns (uint256) {
        return supplies.length;
    }

    function createToken(uint256 _amount, uint256 _price) external onlyOwner {
        supplies.push(_amount);
        uint256 id = supplies.length;
        price[id] = _price;
        emit newToken(id, _amount,_price);
    }

    function createTokenBatch(
        uint256[] calldata _amount,
        uint256[] calldata _prices
    ) external onlyOwner {
        uint256 id = supplies.length;
        for (uint256 i = 0; i < _amount.length; i++) {
            supplies.push(_amount[i]);
            id = id + 1;
            price[id] = _prices[i];
            emit newToken(id, _amount[i],_prices[i]);
        }
    }

    function mint(uint256 _id, uint256 _amount) external payable {
        uint256 temp = supplies[_id - 1];

        require(msg.value >= price[_id] * _amount, "Insufficient amount");
        require(_id > 0 && _id <= supplies.length, "Not a valid ID");
        require(temp > 0, "Token out of supply");
        require(temp >= _amount, "Cant mint given amount of tokens");
        supplies[_id - 1] = temp - _amount;
        _mint(msg.sender, _id, _amount, "");
    }

    function mintBatch(uint256[] calldata _ids, uint256[] calldata _amounts)
        external
        payable
    {
        uint256 paid = msg.value;
        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 temp = supplies[_ids[i] - 1];
            require(
                _ids[i] > 0 && _ids[i] <= supplies.length,
                "Not a valid ID"
            );

            require(paid >= price[i] * _amounts[i]);
            paid -= price[_ids[i]] * _amounts[i];
            require(temp > 0, "Token out of supply");
            require(temp >= _amounts[i], "Cant mint given amount of tokens");
            supplies[_ids[i] - 1] = temp - _amounts[i];
            _mint(msg.sender, _ids[i], _amounts[i], "");
        }
    }

    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) external {
        _burn(from, id, amount);
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        _burnBatch(from, ids, amounts);
    }
}
