using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SystemCategoryRepository : ISystemCategoryRepository
    {
        private readonly AppDbContext _context;

        public SystemCategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SystemCategory>> GetAllAsync()
        {
            return await _context.SystemCategories
                .Where(sc => sc.IsActive)
                .OrderBy(sc => sc.Name)
                .ToListAsync();
        }

        public async Task<SystemCategory?> GetByIdAsync(int id)
        {
            return await _context.SystemCategories
                .FirstOrDefaultAsync(sc => sc.Id == id && sc.IsActive);
        }
        public async Task<List<SystemCategory>> SearchAsync(string keyword)
        {
            return await _context.SystemCategories
                .Where(c => c.IsActive && c.Name.Contains(keyword))
                .OrderBy(c => c.Name)
                .ToListAsync();
        }
        public async Task<SystemCategory> CreateAsync(SystemCategory systemCategory)
        {
            _context.SystemCategories.Add(systemCategory);

            await _context.SaveChangesAsync();

            return systemCategory;
        }

        public async Task UpdateAsync(SystemCategory systemCategory)
        {
            _context.SystemCategories.Update(systemCategory);

            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
        {
            return await _context.SystemCategories
                .AnyAsync(sc => sc.Name == name && sc.IsActive && (excludeId == null || sc.Id != excludeId));
        }
    }
}
