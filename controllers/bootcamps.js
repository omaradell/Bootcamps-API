// Desc Gett All 
// Route GET /api/v1/bootcamps
// accesss public 

exports.getBootcamps = (req , res , next ) => {
    res.json({success : true , msg :"display all booot"})
}

// Desc Gett bootcamp
// Route GET /api/v1/bootcamps/:id
// accesss public 

exports.getBootcamp = (req , res , next ) => {
    res.json({success : true , msg :`display booot of ${req.params.id}` })

}

// Desc Create Bootcamps
// Route POST /api/v1/bootcamps
// accesss private

exports.createBootcamps = (req , res , next ) => {
    res.json({success : true , msg :`create booot ` })

}

// Desc Update 
// Route PUT /api/v1/bootcamps/:id
// accesss Private  

exports.updateBootcamps = (req , res , next ) => {
    res.json({success : true , msg :`update booot of ${req.params.id}` })

}

// Desc delete 
// Route DELETE /api/v1/bootcamps/:id
// accesss Private 

exports.deleteBootcamps = (req , res , next ) => {
    res.json({success : true , msg :`delete booot of ${req.params.id}` })

}


