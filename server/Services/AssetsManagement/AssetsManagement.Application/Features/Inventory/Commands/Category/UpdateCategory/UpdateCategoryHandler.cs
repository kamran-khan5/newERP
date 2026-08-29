using Microsoft.EntityFrameworkCore;

public class UpdateCategoryHandler(IApplicationDbContext context) : ICommandHandler<UpdateCategoryCommand, Result<UpdateCategoryResult>>
{
  public async Task<Result<UpdateCategoryResult>> Handle(UpdateCategoryCommand command, CancellationToken cancellationToken)
  {
    var category = await context.InventoryCategories.FirstOrDefaultAsync(c => c.Id == InventoryCategoryId.Of(command.Id), cancellationToken);
    if (category == null)
    {
      throw new CategoryNotFoundException("Category Not Found");
    }

    UpdateCategory(category, command.Category);
    context.InventoryCategories.Update(category);
    await context.SaveChangesAsync(cancellationToken);
    return Result<UpdateCategoryResult>.Success(new UpdateCategoryResult(true));

  }

  private void UpdateCategory(InventoryCategory category, CategoryDto categoryDto)
  {
    category.Update(Code.Of(categoryDto.Code), Name.Of(categoryDto.Name), categoryDto.Description, categoryDto.IsActive);
  }
}