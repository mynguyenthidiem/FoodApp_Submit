using backend.DTOs.SystemCategory;

namespace backend.Services.Interfaces
{
    public interface ISystemCategoryService
    {
        Task<List<SystemCategoryDto>> GetAllAsync();

        Task<SystemCategoryDto?> GetByIdAsync(int id);

        Task<SystemCategoryDto> CreateAsync(CreateSystemCategoryDto dto);
        Task<List<SystemCategoryDto>> SearchAsync(string keyword);

        Task UpdateAsync(int id, UpdateSystemCategoryDto dto);

        Task DeleteAsync(int id);
    }
}
