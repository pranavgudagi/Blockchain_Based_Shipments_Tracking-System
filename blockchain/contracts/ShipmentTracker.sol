// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ShipmentTracker {
    enum ShipmentStatus { Created, PickedUp, InTransit, OutForDelivery, Delivered }

    struct PackagingSpec {
        uint256 weight;        // in grams
        string dimensions;     // LxWxH format
        string materials;      // packaging materials used
    }

    struct Shipment {
        string trackingId;
        string itemName;
        string itemDescription;
        PackagingSpec packaging;
        address packagingCompany;
        address carrier;
        address customer;
        ShipmentStatus status;
        bool isAuthentic;
        uint256 createdAt;
        uint256 lastUpdatedAt;
    }

    mapping(string => Shipment) public shipments;
    string[] public allTrackingIds;

    // Events for transparency & audit trail
    event ShipmentCreated(string trackingId, string itemName, address indexed company, uint256 timestamp);
    event ShipmentStatusUpdated(string trackingId, ShipmentStatus newStatus, address indexed updatedBy, uint256 timestamp);
    event ShipmentVerified(string trackingId, address indexed verifiedBy, uint256 timestamp);
    event ShipmentFlagged(string trackingId, address indexed flaggedBy, string reason, uint256 timestamp);
    
    modifier shipmentExists(string memory _trackingId) {
        require(bytes(shipments[_trackingId].trackingId).length != 0, "Shipment does not exist");
        _;
    }

    modifier shipmentNotExists(string memory _trackingId) {
        require(bytes(shipments[_trackingId].trackingId).length == 0, "Shipment already exists");
        _;
    }

    function createShipment(
        string memory _trackingId,
        string memory _itemName,
        string memory _itemDescription,
        uint256 _weight,
        string memory _dimensions,
        string memory _materials,
        address _carrier,
        address _customer
    ) public shipmentNotExists(_trackingId) {
        PackagingSpec memory spec = PackagingSpec({
            weight: _weight,
            dimensions: _dimensions,
            materials: _materials
        });

        shipments[_trackingId] = Shipment({
            trackingId: _trackingId,
            itemName: _itemName,
            itemDescription: _itemDescription,
            packaging: spec,
            packagingCompany: msg.sender,
            carrier: _carrier,
            customer: _customer,
            status: ShipmentStatus.Created,
            isAuthentic: true,
            createdAt: block.timestamp,
            lastUpdatedAt: block.timestamp
        });

        allTrackingIds.push(_trackingId);
        emit ShipmentCreated(_trackingId, _itemName, msg.sender, block.timestamp);
    }

    function updateShipmentStatus(
        string memory _trackingId, 
        ShipmentStatus _newStatus
    ) public shipmentExists(_trackingId) {
        Shipment storage s = shipments[_trackingId];
        require(uint(_newStatus) > uint(s.status), "Cannot revert to earlier status");
        s.status = _newStatus;
        s.lastUpdatedAt = block.timestamp;
        emit ShipmentStatusUpdated(_trackingId, _newStatus, msg.sender, block.timestamp);
    }

    // Smart contract for verification — triggered by RFID / QR code scan
    function verifyShipment(
        string memory _trackingId
    ) public shipmentExists(_trackingId) {
        Shipment storage s = shipments[_trackingId];
        require(s.isAuthentic, "Shipment already flagged as inauthentic");
        emit ShipmentVerified(_trackingId, msg.sender, block.timestamp);
    }

    // Flag a shipment as potentially tampered
    function flagShipment(
        string memory _trackingId,
        string memory _reason
    ) public shipmentExists(_trackingId) {
        Shipment storage s = shipments[_trackingId];
        s.isAuthentic = false;
        s.lastUpdatedAt = block.timestamp;
        emit ShipmentFlagged(_trackingId, msg.sender, _reason, block.timestamp);
    }

    function getShipment(
        string memory _trackingId
    ) public view shipmentExists(_trackingId) returns (Shipment memory) {
        return shipments[_trackingId];
    }

    function getTotalShipments() public view returns (uint256) {
        return allTrackingIds.length;
    }

    function getTrackingIdByIndex(uint256 _index) public view returns (string memory) {
        require(_index < allTrackingIds.length, "Index out of bounds");
        return allTrackingIds[_index];
    }
}