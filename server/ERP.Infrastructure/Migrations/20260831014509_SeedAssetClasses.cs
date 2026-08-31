using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAssetClasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AssetClasses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "AssetClasses",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "AssetClasses",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.Sql(@"
INSERT INTO ""AssetClasses"" (""Id"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAtUtc"")
VALUES 
    (1, 'PHY', 'Physical Assets', 'Tangible property including land, buildings, vehicles, machinery, and office equipment.', TRUE, '2026-01-01T00:00:00Z'),
    (2, 'FIN', 'Financial Assets', 'Monetary resources including bank deposits, investments, securities, and receivables.', TRUE, '2026-01-01T00:00:00Z'),
    (3, 'INT', 'Intangible Assets', 'Non-physical property including software licenses, patents, trademarks, and digital rights.', TRUE, '2026-01-01T00:00:00Z'),
    (4, 'INV', 'Inventory & Supplies', 'Operational stock, spare parts, raw materials, and consumables held for use or distribution.', TRUE, '2026-01-01T00:00:00Z')
ON CONFLICT (""Id"") DO UPDATE 
SET ""Code"" = EXCLUDED.""Code"",
    ""Name"" = EXCLUDED.""Name"",
    ""Description"" = EXCLUDED.""Description"",
    ""IsActive"" = EXCLUDED.""IsActive"";
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AssetClasses",
                keyColumn: "Id",
                keyValue: (short)1);

            migrationBuilder.DeleteData(
                table: "AssetClasses",
                keyColumn: "Id",
                keyValue: (short)2);

            migrationBuilder.DeleteData(
                table: "AssetClasses",
                keyColumn: "Id",
                keyValue: (short)3);

            migrationBuilder.DeleteData(
                table: "AssetClasses",
                keyColumn: "Id",
                keyValue: (short)4);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AssetClasses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "AssetClasses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "AssetClasses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);
        }
    }
}
