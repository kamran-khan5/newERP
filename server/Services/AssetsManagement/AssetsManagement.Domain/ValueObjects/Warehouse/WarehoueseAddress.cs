public sealed record Address
{
  public string Street { get; }
  public string? Building { get; }
  public string City { get; }
  public string? State { get; }
  public string PostalCode { get; }
  public string Country { get; }
  public double? Longitude { get; } 
  public double? Latitude { get; }   

  private Address(
      string street,
      string? building,
      string city,
      string? state,
      string postalCode,
      string country,
      double? longitude,
      double? latitude)
  {
    Street = street;
    Building = building;
    City = city;
    State = state;
    PostalCode = postalCode;
    Country = country;
    Longitude = longitude;
    Latitude = latitude;
  }

  public static Address Of(
      string street,
      string? building,
      string city,
      string? state,
      string postalCode,
      string country,
      double? longitude = null,
      double? latitude = null)
  {
    // Street validation
    if (string.IsNullOrWhiteSpace(street))
      throw new DomainException("Street is required.");

    if (street.Length > 200)
      throw new DomainException("Street cannot exceed 200 characters.");

    // City validation
    if (string.IsNullOrWhiteSpace(city))
      throw new DomainException("City is required.");

    if (city.Length > 100)
      throw new DomainException("City cannot exceed 100 characters.");

    // Postal code validation
    if (string.IsNullOrWhiteSpace(postalCode))
      throw new DomainException("Postal code is required.");

    if (postalCode.Length > 20)
      throw new DomainException("Postal code cannot exceed 20 characters.");

    // Country validation
    if (string.IsNullOrWhiteSpace(country))
      throw new DomainException("Country is required.");

    if (country.Length > 100)
      throw new DomainException("Country cannot exceed 100 characters.");

    if (longitude.HasValue && (longitude < -180 || longitude > 180))
      throw new DomainException("Longitude must be between -180 and 180.");

    if (latitude.HasValue && (latitude < -90 || latitude > 90))
      throw new DomainException("Latitude must be between -90 and 90.");

    return new Address(
        street.Trim(),
        building?.Trim(),
        city.Trim(),
        state?.Trim(),
        postalCode.Trim(),
        country.Trim(),
        longitude,
        latitude
    );
  }


  public  bool HasCoordinates => Longitude.HasValue && Latitude.HasValue;

  public string? Coordinates => HasCoordinates
      ? $"{Latitude}, {Longitude}"
      : null;

  public  string? GoogleMapsUrl => HasCoordinates
      ? $"https://www.google.com/maps?q={Latitude},{Longitude}"
      : null;

  public override string ToString()
  {
    var address = $"{Street}";

    if (!string.IsNullOrWhiteSpace(Building))
      address += $", {Building}";

    address += $", {City}";

    if (!string.IsNullOrWhiteSpace(State))
      address += $", {State}";

    address += $" {PostalCode}, {Country}";

    return address;
  }
}