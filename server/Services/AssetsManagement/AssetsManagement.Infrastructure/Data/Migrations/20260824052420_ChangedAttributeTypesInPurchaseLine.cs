using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetsManagement.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangedAttributeTypesInPurchaseLine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency_Value",
                table: "PurchaseLines");

            migrationBuilder.DropColumn(
                name: "DiscountAmount_Amount",
                table: "PurchaseLines");

            migrationBuilder.DropColumn(
                name: "DiscountAmount_Currency",
                table: "PurchaseLines");

            migrationBuilder.DropColumn(
                name: "LineTotal_Currency",
                table: "PurchaseLines");

            migrationBuilder.DropColumn(
                name: "TaxAmount_Currency",
                table: "PurchaseLines");

            migrationBuilder.RenameColumn(
                name: "TaxAmount_Amount",
                table: "PurchaseLines",
                newName: "TaxAmount");

            migrationBuilder.RenameColumn(
                name: "LineTotal_Amount",
                table: "PurchaseLines",
                newName: "DiscountAmount");

            migrationBuilder.AddColumn<decimal>(
                name: "LineTotal",
                table: "PurchaseLines",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LineTotal",
                table: "PurchaseLines");

            migrationBuilder.RenameColumn(
                name: "TaxAmount",
                table: "PurchaseLines",
                newName: "TaxAmount_Amount");

            migrationBuilder.RenameColumn(
                name: "DiscountAmount",
                table: "PurchaseLines",
                newName: "LineTotal_Amount");

            migrationBuilder.AddColumn<string>(
                name: "Currency_Value",
                table: "PurchaseLines",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmount_Amount",
                table: "PurchaseLines",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "DiscountAmount_Currency",
                table: "PurchaseLines",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LineTotal_Currency",
                table: "PurchaseLines",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxAmount_Currency",
                table: "PurchaseLines",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");
        }
    }
}
