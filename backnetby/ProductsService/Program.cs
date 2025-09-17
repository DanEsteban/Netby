using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using ProductsService.Persistence; // tu AppDbContext
using ProductsService.Repositories;
using ProductsService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("allow_frontend", p => p
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:5173", "http://localhost:3000"));
});


var cs = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("Missing ConnectionStrings:Default");

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var sv = ServerVersion.AutoDetect(cs);
    opt.UseMySql(cs, sv, my => my.SchemaBehavior(MySqlSchemaBehavior.Ignore));
});

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("allow_frontend");
// app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
