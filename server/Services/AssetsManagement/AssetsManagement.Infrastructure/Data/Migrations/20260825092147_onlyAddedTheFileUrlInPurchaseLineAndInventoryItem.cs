using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetsManagement.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class onlyAddedTheFileUrlInPurchaseLineAndInventoryItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "WorkInProgress");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "Warehouses");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "ProductionOrder");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "MaterialConsumption");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "InventoryTypes");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "InventoryStocks");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "InventoryCategories");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "FinishedGoodItem");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "WorkInProgress",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "Warehouses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "Purchases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "ProductionOrder",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "MaterialConsumption",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "InventoryTypes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "InventoryStocks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "InventoryCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "FinishedGoodItem",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
