using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class DriverRepository : IDriverRepository
    {
        private readonly AppDbContext _context;

        public DriverRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DriverProfile?> GetProfileByUserId(int userId)
        {
            return await _context.DriverProfiles
                .Include(dp => dp.User)
                .FirstOrDefaultAsync(dp => dp.UserId == userId);
        }

        public async Task<DriverProfile> CreateProfile(DriverProfile profile)
        {
            _context.DriverProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task UpdateProfile(DriverProfile profile)
        {
            _context.DriverProfiles.Update(profile);
            await _context.SaveChangesAsync();
        }
    }
}
