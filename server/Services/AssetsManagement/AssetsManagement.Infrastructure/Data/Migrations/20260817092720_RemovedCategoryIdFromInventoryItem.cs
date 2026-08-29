using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetsManagement.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovedCategoryIdFromInventoryItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryCategories_InventoryCategoryId",
                table: "InventoryItems");

            migrationBuilder.RenameColumn(
                name: "InventoryCategoryId",
                table: "InventoryItems",
                newName: "InventoryTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryItems_InventoryCategoryId",
                table: "InventoryItems",
                newName: "IX_InventoryItems_InventoryTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryTypes_InventoryTypeId",
                table: "InventoryItems",
                column: "InventoryTypeId",
                principalTable: "InventoryTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryTypes_InventoryTypeId",
                table: "InventoryItems");

            migrationBuilder.RenameColumn(
                name: "InventoryTypeId",
                table: "InventoryItems",
                newName: "InventoryCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryItems_InventoryTypeId",
                table: "InventoryItems",
                newName: "IX_InventoryItems_InventoryCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryCategories_InventoryCategoryId",
                table: "InventoryItems",
                column: "InventoryCategoryId",
                principalTable: "InventoryCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
