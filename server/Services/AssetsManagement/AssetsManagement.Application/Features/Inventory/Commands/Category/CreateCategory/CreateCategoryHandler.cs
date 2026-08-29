using Mapster;

public class CreateCategoryHandler(IApplicationDbContext context) : ICommandHandler<CreateCategoryCommand, Result<CreateCategoryResult>>
{
  public async Task<Result<CreateCategoryResult>> Handle(CreateCategoryCommand command, CancellationToken cancellationToken)
  {
    var category = CreateCategory(command.Category);
    await context.InventoryCategories.AddAsync(category);
    await context.SaveChangesAsync(cancellationToken);
    return Result<CreateCategoryResult>.Success(new CreateCategoryResult(category.Id.Value));
  }

  private InventoryCategory CreateCategory(CategoryDto categoryDto)
  {
    
    var category= InventoryCategory.Create(
    inventoryCategoryId: InventoryCategoryId.Of(Guid.NewGuid()),
    code: Code.Of(categoryDto.Code),
    name: Name.Of(categoryDto.Name),
    description: categoryDto.Description,
    isActive: categoryDto.IsActive
    );

    return category;

  }
}