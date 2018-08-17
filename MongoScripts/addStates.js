const STATES = [
    {"name": "Aguascalientes" ,"status":true},
    {"name": "Baja California" ,"status":true},
    {"name": "Baja California Sur" ,"status":true},
    {"name": "Campeche" ,"status":true},
    {"name": "Chihuahua" ,"status":true},
    {"name": "Chiapas" ,"status":true},
    {"name": "Coahuila" ,"status":true},
    {"name": "Colima" ,"status":true},
    {"name": "Durango" ,"status":true},
    {"name": "Guanajuato" ,"status":true},
    {"name": "Guerrero" ,"status":true},
    {"name": "Hidalgo" ,"status":true},
    {"name": "Jalisco" ,"status":true},
    {"name": "México" ,"status":true},
    {"name": "Michoacán" ,"status":true},
    {"name": "Morelos" ,"status":true},
    {"name": "Nayarit" ,"status":true},
    {"name": "Nuevo Leon" ,"status":true},
    {"name": "Oaxaca" ,"status":true},
    {"name": "Puebla" ,"status":true},
    {"name": "Querétaro" ,"status":true},
    {"name": "Quintana Roo" ,"status":true},
    {"name": "San Luis Potosí" ,"status":true},
    {"name": "Sinaloa" ,"status":true},
    {"name": "Sonora" ,"status":true},
    {"name": "Tabasco" ,"status":true},
    {"name": "Tamaulipas" ,"status":true},
    {"name": "Tlaxcala" ,"status":true},
    {"name": "Veracruz" ,"status":true},
    {"name": "Yucatán" ,"status":true},
    {"name": "Zacatecas" ,"status":true},
    {"name": "CDMX","status":true }
];

for(var state of STATES){
	db.states.insertOne(state);
}