pragma solidity >=0.7.0 <0.9.0;



contract CovidSupplyChain {

    enum BatchStatus { MANUFACTURED, DELIVER_NATIONAL, STORED_NATIONAL, DELIVER_REGIONAL, STORED_REGIONAL, DELIVER_HUB, STORED_HUB, USED}
    enum ActorRoles  { MANUFACTURER, COURIER, NATIONAL_FACILITIES, REGIONAL_FACILITIES, VAX_HUB}

    struct Actor
    {
        address id;
        string name;
        ActorRoles role;
    }

    struct VaccineBatch 
    {
        uint size;
        mapping (uint => Actor) chain_actors;
        mapping (uint => uint)  chain_dates;
    }

    VaccineBatch[] batches;
    mapping (address => Actor) actors;

    event AddActor (address id, string name, ActorRoles role);
    event AddBatch ( uint id, uint size, address manufacturer, uint date);
    event UpdateStatus (uint id, BatchStatus status, address actor, uint date);


    function addActor (string memory _name, uint _role) public 
    {
        ActorRoles role =  ActorRoles(_role);
        Actor memory member = Actor(msg.sender, _name, role);

        actors[msg.sender] = member;

        emit AddActor(member.id, member.name, member.role);
    }

    function getActor (address _actor) public view returns ( address, string memory,  uint)
    {
        return (actors[_actor].id, actors[_actor].name, uint(actors[_actor].role)) ;
    }


}