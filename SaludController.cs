using Microsoft.AspNetCore.Mvc;
using MediCheckApi.Models;

[ApiController]
[Route("api/[controller]")]
public class SaludController : ControllerBase
{
    // Lista en memoria para el prototipo
    private static List<Medicamento> _medicamentos = new List<Medicamento>
    {
        new Medicamento { Id = 1, Nombre = "Aspirina", Dosis = "100mg", Horario = "08:00", Tomado = false }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Medicamento>> Get()
    {
        return Ok(_medicamentos);
    }

    [HttpPost]
    public ActionResult Post([FromBody] Medicamento nuevoMed)
    {
        nuevoMed.Id = _medicamentos.Count + 1;
        _medicamentos.Add(nuevoMed);
        return CreatedAtAction(nameof(Get), new { id = nuevoMed.Id }, nuevoMed);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id)
    {
        var med = _medicamentos.FirstOrDefault(x => x.Id == id);
        if (med == null) return NotFound();
        
        med.Tomado = !med.Tomado; // Cambia el estado
        return NoContent();
    }
}