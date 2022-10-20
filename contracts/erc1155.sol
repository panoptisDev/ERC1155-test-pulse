pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract tokens is ERC1155{
    uint[] public supplies=[1,1,1,1,1,100,100,100,100,100];
    address immutable i_owner;
    event newToken(uint ID, uint amount);
    
    constructor() ERC1155("xyz.com"){
        i_owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==i_owner);
        _;
    }

    function totalTypes() external view returns(uint){
        return supplies.length;
    }
    function createToken(uint _amount) onlyOwner() external{
        supplies.push(_amount);
        uint id= supplies.length;
        emit newToken(id,_amount);
    }

    function createTokenBatch(uint[] calldata _amount) onlyOwner() external{
         uint id= supplies.length;       
        for(uint i=0;i<_amount.length;i++){
            supplies.push(_amount[i]);
            id=id+1;
            emit newToken(id,_amount[i]);           
        }
    }
    
   
    function mint(uint _id, uint _amount) external{
        require(_id>0 && _id <= supplies.length,"Not a valid ID");
        require(supplies[_id-1]>0,"Token out of supply");
        require(supplies[_id-1] >= _amount,"Cant mint given amount of tokens");
        supplies[_id-1] =supplies[_id-1]-  _amount;
        _mint(msg.sender,_id,_amount,"");
    }
   
    function mintBatch(uint[] calldata _ids, uint[] calldata _amounts) external{
        for(uint i=0;i<_ids.length;i++){
            require(_ids[i]>0 && _ids[i] <= supplies.length,"Not a valid ID");
            require(supplies[_ids[i]-1]>0,"Token out of supply");
            require(supplies[_ids[i]-1] >= _amounts[i],"Cant mint given amount of tokens");
            supplies[_ids[i]-1] = supplies[_ids[i]-1]-_amounts[i];
            _mint(msg.sender,_ids[i],_amounts[i],"");
        }
    }

    function burn( address from, uint256 id, uint256 amount ) external {
        _burn( from, id, amount );
    }

    function burnBatch( address from, uint256[] memory ids, uint256[] memory amounts) external {
        _burnBatch(from ,ids, amounts) ;
    }
} 