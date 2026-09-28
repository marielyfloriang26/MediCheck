namespace MediCheckApi.Models
{
    public class Medicamento
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Dosis { get; set; } = string.Empty;
        public string Horario { get; set; } = string.Empty;
        public bool Tomado { get; set; }
    }
}