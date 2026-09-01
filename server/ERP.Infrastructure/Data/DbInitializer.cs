using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Domain.Entities.Asset;
using ERP.Domain.Enums.Asset;

namespace ERP.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        // 1. Seed Asset Classes if missing
        if (!await context.AssetClasses.AnyAsync())
        {
            var classes = new List<AssetClass>
            {
                new() { Id = 1, Code = "PHY", Name = "Physical Assets", Description = "Tangible property including land, buildings, vehicles, machinery, and office equipment.", IsActive = true },
                new() { Id = 2, Code = "FIN", Name = "Financial Assets", Description = "Monetary resources including bank deposits, investments, securities, and receivables.", IsActive = true },
                new() { Id = 3, Code = "INT", Name = "Intangible Assets", Description = "Non-physical property including software licenses, patents, trademarks, and digital rights.", IsActive = true },
                new() { Id = 4, Code = "INV", Name = "Inventory & Supplies", Description = "Operational stock, spare parts, raw materials, and consumables held for use or distribution.", IsActive = true }
            };
            await context.AssetClasses.AddRangeAsync(classes);
            await context.SaveChangesAsync();
        }

        // 2. Seed Asset Statuses
        if (!await context.AssetStatuses.AnyAsync())
        {
            var statuses = new List<AssetStatus>
            {
                new() { Id = 1, Code = "DRAFT", Name = "Draft", Description = "Asset record created but pending verification or activation.", IsActive = true },
                new() { Id = 2, Code = "ACTIVE", Name = "In Use", Description = "Asset is commissioned and in active operational service.", IsActive = true },
                new() { Id = 3, Code = "IN_MAINTENANCE", Name = "Under Maintenance", Description = "Asset is temporarily out of service for repair or routine maintenance.", IsActive = true },
                new() { Id = 4, Code = "IDLE", Name = "Idle / Storage", Description = "Asset is functional but not currently in active deployment.", IsActive = true },
                new() { Id = 5, Code = "RESERVED", Name = "Reserved", Description = "Asset is allocated or reserved for an upcoming project or transfer.", IsActive = true },
                new() { Id = 6, Code = "DISPOSED", Name = "Disposed", Description = "Asset has been retired, sold, scrapped, or written off.", IsActive = true }
            };
            await context.AssetStatuses.AddRangeAsync(statuses);
            await context.SaveChangesAsync();
        }

        // 3. Seed Currencies
        if (!await context.Currencies.AnyAsync())
        {
            var currencies = new List<Currency>
            {
                new() { Code = "PKR", Name = "Pakistani Rupee", Symbol = "Rs" },
                new() { Code = "USD", Name = "US Dollar", Symbol = "$" },
                new() { Code = "EUR", Name = "Euro", Symbol = "€" },
                new() { Code = "GBP", Name = "British Pound", Symbol = "£" },
                new() { Code = "AED", Name = "UAE Dirham", Symbol = "AED" },
                new() { Code = "SAR", Name = "Saudi Riyal", Symbol = "SAR" }
            };
            await context.Currencies.AddRangeAsync(currencies);
            await context.SaveChangesAsync();
        }

        // 4. Seed Depreciation Methods
        if (!await context.DepreciationMethods.AnyAsync())
        {
            var methods = new List<DepreciationMethod>
            {
                new() { Id = 1, Code = "STRAIGHT_LINE", Name = "Straight Line", Description = "Even allocation of depreciation expense across the asset's useful life.", IsActive = true },
                new() { Id = 2, Code = "DECLINING_BALANCE", Name = "Declining Balance", Description = "Accelerated depreciation providing higher deductions in early years.", IsActive = true },
                new() { Id = 3, Code = "SUM_OF_YEARS", Name = "Sum-of-the-Years'-Digits", Description = "Accelerated method based on decreasing fraction of initial depreciable amount.", IsActive = true },
                new() { Id = 4, Code = "UNITS_OF_PRODUCTION", Name = "Units of Production", Description = "Depreciation based on actual operational output or usage hours.", IsActive = true }
            };
            await context.DepreciationMethods.AddRangeAsync(methods);
            await context.SaveChangesAsync();
        }

        // 5. Seed Lifecycle Event Types
        if (!await context.LifecycleEventTypes.AnyAsync())
        {
            var eventTypes = new List<LifecycleEventType>
            {
                new() { Id = 1, Stage = "Onboarding", Code = "ACQUISITION", Name = "Acquisition", Description = "Initial purchase, donation, or transfer into the organization.", IsActive = true },
                new() { Id = 2, Stage = "Operation", Code = "ASSIGNMENT", Name = "Assignment / Relocation", Description = "Assignment to a custodian or transfer to a different location.", IsActive = true },
                new() { Id = 3, Stage = "Operation", Code = "MAINTENANCE", Name = "Maintenance & Servicing", Description = "Preventative maintenance, routine inspection, or corrective repairs.", IsActive = true },
                new() { Id = 4, Stage = "Audit", Code = "AUDIT", Name = "Physical Audit", Description = "Physical verification and status check by internal or external auditors.", IsActive = true },
                new() { Id = 5, Stage = "Financial", Code = "VALUATION", Name = "Revaluation / Impairment", Description = "Adjustment of book value due to market changes or impairment.", IsActive = true },
                new() { Id = 6, Stage = "Retirement", Code = "DISPOSAL", Name = "Disposal / Write-off", Description = "Final retirement, decommissioning, auction, or scrapping.", IsActive = true }
            };
            await context.LifecycleEventTypes.AddRangeAsync(eventTypes);
            await context.SaveChangesAsync();
        }

        // 6. Seed Hierarchical Locations
        if (!await context.Locations.AnyAsync())
        {
            // Level 1: Sites
            var locHq = new Location { Id = 1, ParentLocationId = null, Code = "GDA_HQ", Name = "GDA Head Office — Abbottabad", LocationType = "SITE", Address = "Main Pine Road, Abbottabad", IsActive = true };
            var locIslamabad = new Location { Id = 2, ParentLocationId = null, Code = "ISB_OFFICE", Name = "Liaison Office — Islamabad", LocationType = "SITE", Address = "Blue Area, Sector F-6, Islamabad", IsActive = true };
            var locNathiagali = new Location { Id = 3, ParentLocationId = null, Code = "NG_SITE", Name = "Site Office — Nathiagali", LocationType = "SITE", Address = "Nathiagali Bazar, Galiyat", IsActive = true };
            var locMurree = new Location { Id = 4, ParentLocationId = null, Code = "MUR_OFFICE", Name = "Regional Office — Murree", LocationType = "SITE", Address = "Mall Road, Murree", IsActive = true };

            await context.Locations.AddRangeAsync(locHq, locIslamabad, locNathiagali, locMurree);
            await context.SaveChangesAsync();

            // Level 2: Buildings
            var locAdmin = new Location { Id = 5, ParentLocationId = 1, Code = "ADMIN_BLDG", Name = "Administration Block", LocationType = "BUILDING", Address = "East Wing, GDA HQ", IsActive = true };
            var locMain = new Location { Id = 6, ParentLocationId = 1, Code = "MAIN_OFFICE", Name = "Main Complex", LocationType = "BUILDING", Address = "Central Wing, GDA HQ", IsActive = true };
            var locWarehouse = new Location { Id = 7, ParentLocationId = 1, Code = "WH_MAIN", Name = "Central Warehouse / Store", LocationType = "BUILDING", Address = "Logistics Yard, GDA HQ", IsActive = true };

            await context.Locations.AddRangeAsync(locAdmin, locMain, locWarehouse);
            await context.SaveChangesAsync();

            // Level 3: Floors / Sections & Rooms
            var locDataCenter = new Location { Id = 8, ParentLocationId = 5, Code = "IT_DC", Name = "IT Data Center (Basement)", LocationType = "FLOOR", Address = "Sub-level 1, Admin Block", IsActive = true };
            var locRoom101 = new Location { Id = 9, ParentLocationId = 5, Code = "ROOM_101", Name = "Room 101 — Executive Suite", LocationType = "ROOM", Address = "1st Floor, Admin Block", IsActive = true };
            var locRoom102 = new Location { Id = 10, ParentLocationId = 5, Code = "ROOM_102", Name = "Room 102 — Operations Hub", LocationType = "ROOM", Address = "1st Floor, Admin Block", IsActive = true };
            var locStoreA = new Location { Id = 11, ParentLocationId = 7, Code = "STORE_A", Name = "Store Room A — Hardware & Tools", LocationType = "ROOM", Address = "Bay 1, Central Warehouse", IsActive = true };

            await context.Locations.AddRangeAsync(locDataCenter, locRoom101, locRoom102, locStoreA);
            await context.SaveChangesAsync();
        }

        // 7. Seed Asset Categories
        if (!await context.AssetCategories.AnyAsync())
        {
            // Level 1: Root categories
            var catIt = new AssetCategory { Id = 1, AssetClassId = 1, ParentCategoryId = null, Code = "IT", Name = "IT Equipment", Description = "Computing, networking, and electronics hardware", Path = "/1", Depth = 0, DisplayOrder = 1, IsActive = true };
            var catVehicles = new AssetCategory { Id = 2, AssetClassId = 1, ParentCategoryId = null, Code = "VEHICLES", Name = "Vehicles & Transport", Description = "Automobiles, transport trucks, and heavy road machinery", Path = "/2", Depth = 0, DisplayOrder = 2, IsActive = true };
            var catBuildings = new AssetCategory { Id = 3, AssetClassId = 1, ParentCategoryId = null, Code = "BUILDINGS", Name = "Real Estate & Buildings", Description = "Offices, rest houses, land parcels, and infrastructural structures", Path = "/3", Depth = 0, DisplayOrder = 3, IsActive = true };
            var catFurniture = new AssetCategory { Id = 4, AssetClassId = 1, ParentCategoryId = null, Code = "FURNITURE", Name = "Furniture & Fixtures", Description = "Desks, conference tables, chairs, and filing units", Path = "/4", Depth = 0, DisplayOrder = 4, IsActive = true };
            var catInvestments = new AssetCategory { Id = 5, AssetClassId = 2, ParentCategoryId = null, Code = "INVESTMENTS", Name = "Investments & Treasury", Description = "Term deposits, government bonds, and cash equivalents", Path = "/5", Depth = 0, DisplayOrder = 5, IsActive = true };
            var catSoftware = new AssetCategory { Id = 6, AssetClassId = 3, ParentCategoryId = null, Code = "SOFTWARE", Name = "Software & Licenses", Description = "Enterprise applications, OS licenses, and cloud subscriptions", Path = "/6", Depth = 0, DisplayOrder = 6, IsActive = true };
            var catRawMaterials = new AssetCategory { Id = 7, AssetClassId = 4, ParentCategoryId = null, Code = "RAW_MATERIAL", Name = "Raw Materials & Supplies", Description = "Construction supplies, asphalt, bitumen, and gravel", Path = "/7", Depth = 0, DisplayOrder = 7, IsActive = true };

            await context.AssetCategories.AddRangeAsync(catIt, catVehicles, catBuildings, catFurniture, catInvestments, catSoftware, catRawMaterials);
            await context.SaveChangesAsync();

            // Level 2: Sub-categories
            var catComputer = new AssetCategory { Id = 8, AssetClassId = 1, ParentCategoryId = 1, Code = "COMPUTER", Name = "Computers & Workstations", Description = "Desktop systems and enterprise workstations", Path = "/1/8", Depth = 1, DisplayOrder = 1, IsActive = true };
            var catServers = new AssetCategory { Id = 9, AssetClassId = 1, ParentCategoryId = 1, Code = "SERVER", Name = "Servers & Networking", Description = "Rack servers, firewalls, and core switches", Path = "/1/9", Depth = 1, DisplayOrder = 2, IsActive = true };
            var catCar = new AssetCategory { Id = 10, AssetClassId = 1, ParentCategoryId = 2, Code = "CAR", Name = "Passenger Cars", Description = "Sedans, SUVs, and passenger vans", Path = "/2/10", Depth = 1, DisplayOrder = 1, IsActive = true };
            var catHeavyMachinery = new AssetCategory { Id = 11, AssetClassId = 1, ParentCategoryId = 2, Code = "HEAVY_MACH", Name = "Heavy Road Machinery", Description = "Snow plows, bulldozers, and loaders", Path = "/2/11", Depth = 1, DisplayOrder = 2, IsActive = true };
            var catOfficeBldg = new AssetCategory { Id = 12, AssetClassId = 1, ParentCategoryId = 3, Code = "OFFICE_BLDG", Name = "Office Buildings", Description = "Administrative headquarters and regional facilities", Path = "/3/12", Depth = 1, DisplayOrder = 1, IsActive = true };

            await context.AssetCategories.AddRangeAsync(catComputer, catServers, catCar, catHeavyMachinery, catOfficeBldg);
            await context.SaveChangesAsync();

            // Level 3: Leaf categories
            var catLaptop = new AssetCategory { Id = 13, AssetClassId = 1, ParentCategoryId = 8, Code = "LAPTOP", Name = "Laptops & Portables", Description = "Staff laptops, ultrabooks, and portable workstations", Path = "/1/8/13", Depth = 2, DisplayOrder = 1, IsActive = true };
            await context.AssetCategories.AddAsync(catLaptop);
            await context.SaveChangesAsync();
        }

        // 8. Seed Category Attributes & Options
        if (!await context.CategoryAttributes.AnyAsync())
        {
            // Laptop attributes (CategoryId: 13)
            var attrManufacturer = new CategoryAttribute { Id = 1, CategoryId = 13, Code = "manufacturer", Name = "Manufacturer", DataType = AttributeDataType.Select, IsRequired = true, IsSearchable = true, IsFilterable = true, DisplayOrder = 1, IsActive = true };
            var attrRam = new CategoryAttribute { Id = 2, CategoryId = 13, Code = "ram", Name = "RAM (GB)", DataType = AttributeDataType.Integer, IsRequired = true, IsSearchable = true, IsFilterable = true, DisplayOrder = 2, IsActive = true };
            var attrOs = new CategoryAttribute { Id = 3, CategoryId = 13, Code = "operating_system", Name = "Operating System", DataType = AttributeDataType.Select, IsRequired = false, IsSearchable = true, IsFilterable = true, DisplayOrder = 3, IsActive = true };
            var attrFeatures = new CategoryAttribute { Id = 4, CategoryId = 13, Code = "features", Name = "Features", DataType = AttributeDataType.MultiSelect, IsRequired = false, IsSearchable = false, IsFilterable = false, DisplayOrder = 4, IsActive = true };
            var attrProcessor = new CategoryAttribute { Id = 5, CategoryId = 13, Code = "processor", Name = "Processor / CPU", DataType = AttributeDataType.Text, IsRequired = false, IsSearchable = true, IsFilterable = false, DisplayOrder = 5, IsActive = true };

            // Passenger Car attributes (CategoryId: 10)
            var attrVin = new CategoryAttribute { Id = 6, CategoryId = 10, Code = "vin", Name = "VIN / Chassis Number", DataType = AttributeDataType.Text, IsRequired = true, IsSearchable = true, IsFilterable = false, DisplayOrder = 1, IsActive = true };
            var attrFuel = new CategoryAttribute { Id = 7, CategoryId = 10, Code = "fuel_type", Name = "Fuel Type", DataType = AttributeDataType.Select, IsRequired = true, IsSearchable = true, IsFilterable = true, DisplayOrder = 2, IsActive = true };
            var attrRegNo = new CategoryAttribute { Id = 8, CategoryId = 10, Code = "registration_no", Name = "Registration Plate", DataType = AttributeDataType.Text, IsRequired = true, IsSearchable = true, IsFilterable = true, DisplayOrder = 3, IsActive = true };
            var attrLeased = new CategoryAttribute { Id = 9, CategoryId = 10, Code = "is_leased_out", Name = "Leased Out", DataType = AttributeDataType.Boolean, IsRequired = false, IsSearchable = false, IsFilterable = true, DisplayOrder = 4, IsActive = true };

            // Software attributes (CategoryId: 6)
            var attrLicenseKey = new CategoryAttribute { Id = 10, CategoryId = 6, Code = "license_key", Name = "License / Product Key", DataType = AttributeDataType.Text, IsRequired = true, IsSearchable = true, IsFilterable = false, DisplayOrder = 1, IsActive = true };
            var attrSeats = new CategoryAttribute { Id = 11, CategoryId = 6, Code = "seat_count", Name = "Seat / User Count", DataType = AttributeDataType.Integer, IsRequired = true, IsSearchable = false, IsFilterable = true, DisplayOrder = 2, IsActive = true };

            await context.CategoryAttributes.AddRangeAsync(attrManufacturer, attrRam, attrOs, attrFeatures, attrProcessor, attrVin, attrFuel, attrRegNo, attrLeased, attrLicenseKey, attrSeats);
            await context.SaveChangesAsync();

            // Options for dropdown attributes
            var options = new List<CategoryAttributeOption>
            {
                // Manufacturer options (AttributeId: 1)
                new() { AttributeId = 1, Value = "DELL", Label = "Dell", DisplayOrder = 1, IsActive = true },
                new() { AttributeId = 1, Value = "HP", Label = "HP", DisplayOrder = 2, IsActive = true },
                new() { AttributeId = 1, Value = "APPLE", Label = "Apple", DisplayOrder = 3, IsActive = true },
                new() { AttributeId = 1, Value = "LENOVO", Label = "Lenovo", DisplayOrder = 4, IsActive = true },
                new() { AttributeId = 1, Value = "ASUS", Label = "Asus", DisplayOrder = 5, IsActive = true },

                // OS options (AttributeId: 3)
                new() { AttributeId = 3, Value = "WIN11", Label = "Windows 11 Pro", DisplayOrder = 1, IsActive = true },
                new() { AttributeId = 3, Value = "WIN10", Label = "Windows 10 Pro", DisplayOrder = 2, IsActive = true },
                new() { AttributeId = 3, Value = "MACOS", Label = "macOS Sequoia", DisplayOrder = 3, IsActive = true },
                new() { AttributeId = 3, Value = "UBUNTU", Label = "Ubuntu Linux 24.04", DisplayOrder = 4, IsActive = true },

                // Features options (AttributeId: 4)
                new() { AttributeId = 4, Value = "WIFI", Label = "Wi-Fi 6E", DisplayOrder = 1, IsActive = true },
                new() { AttributeId = 4, Value = "BLUETOOTH", Label = "Bluetooth 5.3", DisplayOrder = 2, IsActive = true },
                new() { AttributeId = 4, Value = "FINGERPRINT", Label = "Fingerprint Reader", DisplayOrder = 3, IsActive = true },
                new() { AttributeId = 4, Value = "TOUCHSCREEN", Label = "Touchscreen Display", DisplayOrder = 4, IsActive = true },

                // Fuel Type options (AttributeId: 7)
                new() { AttributeId = 7, Value = "PETROL", Label = "Petrol / Gasoline", DisplayOrder = 1, IsActive = true },
                new() { AttributeId = 7, Value = "DIESEL", Label = "Diesel", DisplayOrder = 2, IsActive = true },
                new() { AttributeId = 7, Value = "HYBRID", Label = "Hybrid (HEV/PHEV)", DisplayOrder = 3, IsActive = true },
                new() { AttributeId = 7, Value = "EV", Label = "Electric Vehicle (EV)", DisplayOrder = 4, IsActive = true }
            };
            await context.CategoryAttributeOptions.AddRangeAsync(options);
            await context.SaveChangesAsync();
        }

        // 9. Seed Initial Sample Assets & Acquisitions
        if (!await context.Assets.AnyAsync())
        {
            var seedDate = new DateTime(2025, 6, 15, 0, 0, 0, DateTimeKind.Utc);

            var sampleAssets = new List<(Asset asset, decimal cost, string currency, DateTime purchaseDate, short methodId, int usefulLife)>
            {
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111001"),
                        AssetCode = "AST-PHY-1001",
                        Name = "ThinkPad T14 Gen 4",
                        Description = "Enterprise developer laptop with 32GB RAM and Core i7.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 1,
                        CategoryId = 13, // Laptop
                        StatusId = 2, // In Use
                        CurrentLocationId = 9, // Room 101
                        ExtraAttributes = "{\"manufacturer\":\"LENOVO\",\"ram\":\"32\",\"operating_system\":\"WIN11\",\"features\":[\"WIFI\",\"BLUETOOTH\",\"FINGERPRINT\"]}",
                        IsActive = true
                    },
                    385000m, "PKR", seedDate.AddDays(-120), 1, 36
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111002"),
                        AssetCode = "AST-PHY-1002",
                        Name = "MacBook Pro 16\" M3 Max",
                        Description = "High-performance workstation for GIS mapping and CAD designs.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 1,
                        CategoryId = 13,
                        StatusId = 2,
                        CurrentLocationId = 10, // Room 102
                        ExtraAttributes = "{\"manufacturer\":\"APPLE\",\"ram\":\"36\",\"operating_system\":\"MACOS\",\"features\":[\"WIFI\",\"BLUETOOTH\",\"FINGERPRINT\"]}",
                        IsActive = true
                    },
                    890000m, "PKR", seedDate.AddDays(-200), 1, 36
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111003"),
                        AssetCode = "AST-PHY-1003",
                        Name = "Toyota Hilux 4x4 Double Cabin",
                        Description = "Patrol and inspection vehicle for Galiyat regional monitoring.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 1,
                        CategoryId = 10, // Car
                        StatusId = 2,
                        CurrentLocationId = 1, // GDA HQ
                        ExtraAttributes = "{\"vin\":\"MHF12345678901234\",\"fuel_type\":\"DIESEL\",\"registration_no\":\"GDA-786\"}",
                        IsActive = true
                    },
                    14500000m, "PKR", seedDate.AddMonths(-18), 1, 60
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111004"),
                        AssetCode = "AST-PHY-1004",
                        Name = "Caterpillar 950GC Wheel Loader",
                        Description = "Heavy snow clearing and land leveling machinery for Murree road maintenance.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 1,
                        CategoryId = 11, // Heavy Machinery
                        StatusId = 3, // Under Maintenance
                        CurrentLocationId = 3, // Nathiagali
                        ExtraAttributes = "{\"fuel_type\":\"DIESEL\"}",
                        IsActive = true
                    },
                    38000000m, "PKR", seedDate.AddYears(-2), 1, 120
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111005"),
                        AssetCode = "AST-PHY-1005",
                        Name = "Dell PowerEdge R750 Server",
                        Description = "Primary database and application server hosting the Central ERP system.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 1,
                        CategoryId = 9, // Server
                        StatusId = 2,
                        CurrentLocationId = 8, // IT Data Center
                        ExtraAttributes = "{\"manufacturer\":\"DELL\",\"ram\":\"128\",\"operating_system\":\"UBUNTU\"}",
                        IsActive = true
                    },
                    2450000m, "PKR", seedDate.AddMonths(-6), 1, 48
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111006"),
                        AssetCode = "AST-INT-3001",
                        Name = "Autodesk Infrastructure Design Suite",
                        Description = "Multi-seat commercial license for urban planning and architecture drawings.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 3, // Intangible
                        CategoryId = 6, // Software
                        StatusId = 2,
                        CurrentLocationId = 9,
                        ExtraAttributes = "{\"license_key\":\"AUTODESK-ENT-2026-9921\",\"seat_count\":\"25\"}",
                        IsActive = true
                    },
                    1800000m, "PKR", seedDate.AddMonths(-3), 1, 12
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111007"),
                        AssetCode = "AST-FIN-2001",
                        Name = "National Bank Fixed Term Deposit 3Y",
                        Description = "Capital reserve deposit bearing 18.5% p.a. for infrastructure endowment fund.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 2, // Financial
                        CategoryId = 5, // Investments
                        StatusId = 2,
                        CurrentLocationId = 5, // Admin Block
                        IsActive = true
                    },
                    50000000m, "PKR", seedDate.AddMonths(-10), 1, 36
                ),
                (
                    new Asset
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111008"),
                        AssetCode = "AST-INV-4001",
                        Name = "High Grade Bitumen (60/70 Penetration) — 50 MT",
                        Description = "Road surfacing materials stored for upcoming highway repairs.",
                        Ownership = OwnershipType.Owned,
                        AssetClassId = 4, // Inventory
                        CategoryId = 7, // Raw Material
                        StatusId = 4, // Idle / Storage
                        CurrentLocationId = 11, // Store Room A
                        IsActive = true
                    },
                    8500000m, "PKR", seedDate.AddMonths(-1), 1, 12
                )
            };

            foreach (var item in sampleAssets)
            {
                await context.Assets.AddAsync(item.asset);
                await context.SaveChangesAsync();

                var acquisition = new AssetAcquisition
                {
                    AssetId = item.asset.Id,
                    AcquisitionDate = item.purchaseDate,
                    AcquisitionCost = item.cost,
                    CurrencyCode = item.currency,
                    AcquisitionType = AcquisitionType.Purchase,
                    WarrantyExpiryDate = item.purchaseDate.AddYears(2),
                    PurchaseReference = $"PO-{item.purchaseDate:yyyyMM}-{item.asset.AssetCode.Split('-').Last()}"
                };
                await context.AssetAcquisitions.AddAsync(acquisition);

                var schedule = new AssetDepreciationSchedule
                {
                    AssetId = item.asset.Id,
                    MethodId = item.methodId,
                    UsefulLifeMonths = item.usefulLife,
                    SalvageValue = Math.Round(item.cost * 0.1m, 2),
                    StartDate = item.purchaseDate,
                    IsActive = true
                };
                await context.AssetDepreciationSchedules.AddAsync(schedule);

                await context.SaveChangesAsync();
            }
        }
    }
}
