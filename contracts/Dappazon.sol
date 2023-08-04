// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
  
    address public owner;
    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    struct Order{
        uint256 time;
        Item item;
    }
    mapping(uint256 =>Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address=>mapping(uint256 => Order)) public orders;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    event Buy(address buyer, uint256 orderId, uint256 itemId);
    constructor() {
     
        owner  = msg.sender;
    }
    function list(
    uint256 id_,
    string memory name_,
    string memory category_,
    string memory image_,
    uint256 cost_,uint256 rating_,
    uint256 stock)
    public
    onlyOwner()
    {
        Item memory item = Item(id_,name_,category_,image_,cost_,rating_,stock);
        items[id_] = item;
    }
    function buy(uint256 Id_) public payable {
        Item memory item = items[Id_];
        Order memory order = Order(block.timestamp,item);
        require(msg.value>=item.cost);
        orderCount[msg.sender]+=1;
        orders[msg.sender][orderCount[msg.sender]] = order;
        items[Id_].stock = item.stock-1 ;
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }
    function  withdraw() public onlyOwner() {
        (bool success, ) =owner.call{value : address(this).balance}("");
        require(success);
    }
}
