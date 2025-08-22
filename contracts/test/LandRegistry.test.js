const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  let LandRegistry;
  let landRegistry;
  let owner;
  let official;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    LandRegistry = await ethers.getContractFactory("LandRegistry");
    [owner, official, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new LandRegistry contract for each test
    landRegistry = await LandRegistry.deploy();
    await landRegistry.waitForDeployment();

    // Add official as authorized
    await landRegistry.addAuthorizedOfficial(official.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await landRegistry.owner()).to.equal(owner.address);
    });

    it("Should start with zero lands", async function () {
      expect(await landRegistry.getTotalLands()).to.equal(0);
    });
  });

  describe("Authorization", function () {
    it("Should allow owner to add authorized officials", async function () {
      await landRegistry.addAuthorizedOfficial(addr1.address);
      expect(await landRegistry.authorizedOfficials(addr1.address)).to.equal(true);
    });

    it("Should allow owner to remove authorized officials", async function () {
      await landRegistry.addAuthorizedOfficial(addr1.address);
      await landRegistry.removeAuthorizedOfficial(addr1.address);
      expect(await landRegistry.authorizedOfficials(addr1.address)).to.equal(false);
    });

    it("Should not allow non-owner to add officials", async function () {
      await expect(
        landRegistry.connect(addr1).addAuthorizedOfficial(addr2.address)
      ).to.be.revertedWithCustomError(landRegistry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Land Registration", function () {
    it("Should register a new land by authorized official", async function () {
      const surveyNumber = "SN001";
      const location = "Test Location";
      const area = 1000;
      const ipfsHash = "QmTest123";
      const gpsCoordinates = "12.9716,77.5946";
      const marketValue = ethers.parseEther("1");

      await expect(
        landRegistry.connect(official).registerLand(
          surveyNumber,
          addr1.address,
          location,
          area,
          ipfsHash,
          gpsCoordinates,
          marketValue
        )
      ).to.emit(landRegistry, "LandRegistered")
       .withArgs(1, surveyNumber, addr1.address, location, area);

      expect(await landRegistry.getTotalLands()).to.equal(1);
    });

    it("Should not allow duplicate survey numbers", async function () {
      const surveyNumber = "SN001";
      
      await landRegistry.connect(official).registerLand(
        surveyNumber,
        addr1.address,
        "Test Location",
        1000,
        "QmTest123",
        "12.9716,77.5946",
        ethers.parseEther("1")
      );

      await expect(
        landRegistry.connect(official).registerLand(
          surveyNumber,
          addr2.address,
          "Another Location",
          2000,
          "QmTest456",
          "12.9716,77.5946",
          ethers.parseEther("2")
        )
      ).to.be.revertedWith("Land already registered");
    });

    it("Should not allow unauthorized users to register land", async function () {
      await expect(
        landRegistry.connect(addr1).registerLand(
          "SN001",
          addr2.address,
          "Test Location",
          1000,
          "QmTest123",
          "12.9716,77.5946",
          ethers.parseEther("1")
        )
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Land Transfer", function () {
    beforeEach(async function () {
      // Register a land first
      await landRegistry.connect(official).registerLand(
        "SN001",
        addr1.address,
        "Test Location",
        1000,
        "QmTest123",
        "12.9716,77.5946",
        ethers.parseEther("1")
      );
    });

    it("Should allow land owner to request transfer", async function () {
      await expect(
        landRegistry.connect(addr1).requestTransfer(1, addr2.address, "Sale")
      ).to.emit(landRegistry, "TransferRequested")
       .withArgs(1, addr1.address, addr2.address, 1);

      const land = await landRegistry.getLand(1);
      expect(land.status).to.equal(1); // TRANSFER_PENDING
    });

    it("Should allow authorized official to approve transfer", async function () {
      await landRegistry.connect(addr1).requestTransfer(1, addr2.address, "Sale");
      
      await expect(
        landRegistry.connect(official).approveTransfer(1)
      ).to.emit(landRegistry, "TransferApproved")
       .withArgs(1, addr1.address, addr2.address);

      const transferRequest = await landRegistry.getTransferRequest(1);
      expect(transferRequest.isApproved).to.equal(true);
    });

    it("Should complete transfer after approval", async function () {
      await landRegistry.connect(addr1).requestTransfer(1, addr2.address, "Sale");
      await landRegistry.connect(official).approveTransfer(1);
      
      await expect(
        landRegistry.connect(official).completeTransfer(1)
      ).to.emit(landRegistry, "TransferCompleted")
       .withArgs(1, addr1.address, addr2.address);

      const land = await landRegistry.getLand(1);
      expect(land.currentOwner).to.equal(addr2.address);
      expect(land.previousOwner).to.equal(addr1.address);
    });

    it("Should not allow non-owner to request transfer", async function () {
      await expect(
        landRegistry.connect(addr2).requestTransfer(1, addr1.address, "Sale")
      ).to.be.revertedWith("Not the land owner");
    });
  });

  describe("Land Verification", function () {
    beforeEach(async function () {
      await landRegistry.connect(official).registerLand(
        "SN001",
        addr1.address,
        "Test Location",
        1000,
        "QmTest123",
        "12.9716,77.5946",
        ethers.parseEther("1")
      );
    });

    it("Should allow authorized official to verify land", async function () {
      await expect(
        landRegistry.connect(official).verifyLand(1)
      ).to.emit(landRegistry, "LandVerified")
       .withArgs(1, official.address);

      const land = await landRegistry.getLand(1);
      expect(land.isVerified).to.equal(true);
      expect(land.status).to.equal(3); // VERIFIED
    });

    it("Should not allow unauthorized users to verify land", async function () {
      await expect(
        landRegistry.connect(addr1).verifyLand(1)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Land Queries", function () {
    beforeEach(async function () {
      await landRegistry.connect(official).registerLand(
        "SN001",
        addr1.address,
        "Test Location 1",
        1000,
        "QmTest123",
        "12.9716,77.5946",
        ethers.parseEther("1")
      );
      
      await landRegistry.connect(official).registerLand(
        "SN002",
        addr1.address,
        "Test Location 2",
        2000,
        "QmTest456",
        "12.9716,77.5946",
        ethers.parseEther("2")
      );
    });

    it("Should return correct land details", async function () {
      const land = await landRegistry.getLand(1);
      expect(land.surveyNumber).to.equal("SN001");
      expect(land.currentOwner).to.equal(addr1.address);
      expect(land.location).to.equal("Test Location 1");
      expect(land.area).to.equal(1000);
    });

    it("Should return land ID by survey number", async function () {
      const landId = await landRegistry.getLandIdBySurveyNumber("SN001");
      expect(landId).to.equal(1);
    });

    it("Should return lands owned by an address", async function () {
      const ownedLands = await landRegistry.getLandsByOwner(addr1.address);
      expect(ownedLands.length).to.equal(2);
      expect(ownedLands[0]).to.equal(1);
      expect(ownedLands[1]).to.equal(2);
    });

    it("Should return correct total lands count", async function () {
      expect(await landRegistry.getTotalLands()).to.equal(2);
    });
  });

  describe("Document Updates", function () {
    beforeEach(async function () {
      await landRegistry.connect(official).registerLand(
        "SN001",
        addr1.address,
        "Test Location",
        1000,
        "QmTest123",
        "12.9716,77.5946",
        ethers.parseEther("1")
      );
    });

    it("Should allow authorized official to update document hash", async function () {
      const newHash = "QmNewTest456";
      
      await expect(
        landRegistry.connect(official).updateDocument(1, newHash)
      ).to.emit(landRegistry, "DocumentUpdated")
       .withArgs(1, newHash);

      const land = await landRegistry.getLand(1);
      expect(land.ipfsHash).to.equal(newHash);
    });

    it("Should not allow unauthorized users to update documents", async function () {
      await expect(
        landRegistry.connect(addr1).updateDocument(1, "QmNewHash")
      ).to.be.revertedWith("Not authorized");
    });
  });
});
