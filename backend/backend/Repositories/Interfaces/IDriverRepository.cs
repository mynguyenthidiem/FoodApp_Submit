using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IDriverRepository
    {
        Task<DriverProfile?> GetProfileByUserId(int userId);
        Task<DriverProfile> CreateProfile(DriverProfile profile);
        Task UpdateProfile(DriverProfile profile);
    }
}
