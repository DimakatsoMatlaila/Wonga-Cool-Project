namespace UserAuth.Application.Common.Exceptions;

/// <summary>
/// Custom exception for resource not found errors
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.")
    {
    }
}
