public interface IAggregate<T> : IAggregate, IEntity<T>
{

}

public interface IAggregate : IEntity, IDomainEvent
{
  IReadOnlyList<IDomainEvent> DomainEvents { get; }
  IDomainEvent[] ClearDomainEvents();
}