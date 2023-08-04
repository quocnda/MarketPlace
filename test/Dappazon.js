const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", () => {
  let dappazon
  let deployer,buyer
  const ID = 1
  const name ="T-shirt"
  const cater = "Clothing"
  const image = "anhr 1"
  const cost = tokens(1)
  const Rating = 4
  const stock = 5
  beforeEach(async() => {
    
   [deployer,buyer] = await ethers.getSigners()
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
    // console.log(deployer)

  })
  describe("Deployment", () => {
    it("set the owner", async() => {
      const adres = await dappazon.owner();
      expect(adres).to.equal(deployer.address)
    })
    
     
  })
  describe("Listing",()=> {
    let transaction 
   
    beforeEach(async() => {
      transaction = await dappazon.connect(deployer).list(
        ID,
        name,
        cater,
        image,
        cost,
        Rating,
        stock
      )
      await transaction.wait()
    })
    it("return item", async() => {
      const item  = await dappazon.items(ID)
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(name)
      expect(item.category).to.equal(cater)
      expect(item.image).to.equal(image)
      expect(item.cost).to.equal(cost)
    })
  })
  describe("Buy" , ()=> {
    let transaction 
    beforeEach(async() => {
      transaction = await dappazon.connect(deployer).list(
        ID,
        name,
        cater,
        image,
        cost,
        Rating,
        stock
      )
      await transaction.wait()
      transaction = await dappazon.connect(buyer).buy(ID,{value: cost})

    })
    it("Update order count", async() => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(ID)
    })
    it("Adds the order", async()=> {
      const order = await dappazon.orders(buyer.address,1)
      expect(order.time).to.greaterThan(0)
      expect(order.item.name).to.equal(name)
    })
  })
  describe("Withdraw", () => {
    let balanceBefore
    beforeEach(async()=>{
      let transaction = await dappazon.connect(deployer).list(
        ID,
        name,
        cater,
        image,
        cost,
        Rating,
        stock
      )
      await transaction.wait()

      transaction = await dappazon.connect(buyer).buy(ID,{value : cost})
      await transaction.wait()

      balanceBefore = await ethers.provider.getBalance(deployer.address)
      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
    })
    it("Updates the owner balance", async() => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      console.log(balanceAfter)
      console.log(balanceBefore)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    }) 
  })
})
