using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_AnSonFuelBoss.Migrations
{
    /// <inheritdoc />
    public partial class AddSupplierToImports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SupplierId",
                table: "Imports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalPrice",
                table: "Imports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Imports_SupplierId",
                table: "Imports",
                column: "SupplierId");

            migrationBuilder.AddForeignKey(
                name: "FK_Imports_Suppliers_SupplierId",
                table: "Imports",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Imports_Suppliers_SupplierId",
                table: "Imports");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropIndex(
                name: "IX_Imports_SupplierId",
                table: "Imports");

            migrationBuilder.DropColumn(
                name: "SupplierId",
                table: "Imports");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Imports");
        }
    }
}
