using Microsoft.EntityFrameworkCore;

public class DeleteCategoryHandler(IApplicationDbContext context) : ICommandHandler<DeleteCategoryCommand, Result<DeleteCategoryResult>>
{
  public async Task<Result<DeleteCategoryResult>> Handle(DeleteCategoryCommand command, CancellationToken cancellationToken)
  {
    var category = await context.InventoryCategories.FirstOrDefaultAsync(c => c.Id == InventoryCategoryId.Of(command.Id), cancellationToken);
    if (category == null)
    {
      throw new CategoryNotFoundException("Category Not Found");
    }

    context.InventoryCategories.Remove(category);
    await context.SaveChangesAsync(cancellationToken);
    return Result<DeleteCategoryResult>.Success(new DeleteCategoryResult(true));
  }
}