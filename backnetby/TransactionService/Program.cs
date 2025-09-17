using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Converters;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using TransactionsService.Persistence;
using TransactionsService.Repositories;
using TransactionsService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddNewtonsoftJson(o => o.SerializerSettings.Converters.Add(new StringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ITransactionService, TransactionsService.Services.TransactionService>();
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("allow_frontend");
// app.UseHttpsRedirection(); // descomenta si corres en https

app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
