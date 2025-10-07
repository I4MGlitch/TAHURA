// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const parser = require('body-parser');
const path = require('path');
const compression = require('compression');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Import Schemas
const berita = require('./schemas/berita');
const fauna = require('./schemas/fauna');
const flora = require('./schemas/flora');
const user = require('./schemas/user')
const admin = require('./schemas/admin')
const post = require('./schemas/post')
const quiz = require('./schemas/quiz')
const event = require('./schemas/event')
const report = require('./schemas/report')
const learningModule = require('./schemas/learningModules')

// Initialize app
const app = express();

// // CORS Configuration: allow requests from your frontend domain
// const corsOptions = {
//   origin: 'https://tahura.vercel.app',
//   optionsSuccessStatus: 200
// };
app.use(cors());
app.use(compression());
app.use(parser.json());
app.use(parser.json({ limit: '50mb' }));
app.use(parser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(parser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection using Mongoose
mongoose.connect('mongodb+srv://TAHURA:TAHURA123@tahura.cjtoycf.mongodb.net/TAHURA')
  .then(() => console.log('MongoDB connected to database: TAHURA'))
  .catch(err => console.error('MongoDB connection error:', err));


// Define API routes
app.get('/api/getFloraDetails/:id', async (req, res) => {
  try {
    const floraId = req.params.id;
    const floraDetails = await flora.findById(floraId).exec();
    if (!floraDetails) {
      return res.status(404).json({ error: 'Flora not found' });
    }
    res.json(floraDetails);
  } catch (error) {
    console.error('Error fetching flora details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getFaunaDetails/:id', async (req, res) => {
  try {
    const faunaId = req.params.id;
    const faunaDetails = await fauna.findById(faunaId).exec();
    if (!faunaDetails) {
      return res.status(404).json({ error: 'Fauna not found' });
    }
    res.json(faunaDetails);
  } catch (error) {
    console.error('Error fetching fauna details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getBeritaDetails/:id', async (req, res) => {
  try {
    const beritaId = req.params.id;
    const beritaDetails = await berita.findById(beritaId).exec();
    if (!beritaDetails) {
      return res.status(404).json({ error: 'Berita not found' });
    }
    res.json(beritaDetails);
  } catch (error) {
    console.error('Error fetching berita details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/api/getLazyFlora', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const limit = 6; // Load 6 items at a time
//     const skip = (page - 1) * limit;

//     const floraData = await flora.find().sort({ _id: -1 }).skip(skip).limit(limit);
//     const totalFlora = await flora.countDocuments();

//     res.json({
//       data: floraData,
//       total: totalFlora,
//       page,
//       totalPages: Math.ceil(totalFlora / limit),
//     });
//   } catch (error) {
//     console.error('Error fetching flora data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/api/getLazyFlora', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 6);
    const total = await flora.countDocuments();

    const floraData = await flora.find()
      .sort({ _id: -1 }) // Sort newest first
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ floraData, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/getAllFlora', async (req, res) => {
  try {
    const floraData = await flora.find();
    res.json(floraData);
  } catch (error) {
    console.error('Error fetching flora data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getPartialFlora', async (req, res) => {
  try {
    // Fetch only 5 documents and select specific fields
    const floraData = await flora.find({}, {
      name: 1,
      short_description: 1,
      nameIlmiah: 1,
      photos: { $slice: 1 }
    }).limit(5);

    res.json(floraData);
  } catch (error) {
    console.error('Error fetching flora data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLoadFlora', async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    // Validate and sanitize the page and limit values
    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the flora data with pagination and specific fields
    const floraData = await flora.find({}, {
      name: 1,
      nameIlmiah: 1,
      short_description: 1,
      photos: { $slice: 1 } // Only include the first photo
    })
      .skip(skip)
      .limit(limit)
      .collation({ locale: 'en', strength: 1 }); // Optional: adjust collation for better performance

    res.json(floraData);
  } catch (error) {
    console.error('Error fetching flora data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/flora', upload.array('photos', 3), async (req, res) => {
  try {
    // Get the highest current 'no' and increment it
    const lastFlora = await flora.findOne().sort({ no: -1 });
    const nextNo = lastFlora ? lastFlora.no + 1 : 1; // Start from 1 if no entries exist

    // Extract images
    const photos = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    // Create new flora entry
    const newFlora = new flora({
      name: req.body.name,
      nameIlmiah: req.body.nameIlmiah,
      description: req.body.description, // Same as short_description
      short_description: req.body.description, // Ensuring both fields are identical
      category: req.body.category,
      no: nextNo,
      bentuk: req.body.bentuk,
      akar: req.body.akar,
      daun: req.body.daun,
      lainnya: req.body.lainnya,
      tipeBiji: req.body.tipeBiji,
      kulitKayu: req.body.kulitKayu,
      ciriKhusus: req.body.ciriKhusus,
      bunga: req.body.bunga,
      buah: req.body.buah,
      kegunaan: req.body.kegunaan,
      photos: photos
    });

    // Save to database
    const savedFlora = await newFlora.save();
    res.json(savedFlora);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/api/flora/:id', upload.array('photos', 3), async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing flora entry
    const existingFlora = await flora.findById(id);
    if (!existingFlora) {
      return res.status(404).json({ error: 'Flora not found' });
    }

    // Keep existing photos if none are uploaded
    let updatedPhotos = existingFlora.photos;
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
      updatedPhotos = [...existingFlora.photos, ...newPhotos]; // Append new photos
    }

    // Generate short description (25% of descriptions)
    const fullDescription = req.body.description || existingFlora.description;
    const words = fullDescription.split(" ");
    const shortDescLength = Math.ceil(words.length * 0.25);
    const shortDescription = words.slice(0, shortDescLength).join(" ");

    // Update the flora entry
    const updatedFlora = await flora.findByIdAndUpdate(
      id,
      {
        name: req.body.name || existingFlora.name,
        nameIlmiah: req.body.nameIlmiah || existingFlora.nameIlmiah,
        description: fullDescription,
        short_description: shortDescription,
        category: req.body.category || existingFlora.category,
        bentuk: req.body.bentuk || existingFlora.bentuk,
        akar: req.body.akar || existingFlora.akar,
        daun: req.body.daun || existingFlora.daun,
        lainnya: req.body.lainnya || existingFlora.lainnya,
        tipeBiji: req.body.tipeBiji || existingFlora.tipeBiji,
        kulitKayu: req.body.kulitKayu || existingFlora.kulitKayu,
        ciriKhusus: req.body.ciriKhusus || existingFlora.ciriKhusus,
        bunga: req.body.bunga || existingFlora.bunga,
        buah: req.body.buah || existingFlora.buah,
        kegunaan: req.body.kegunaan || existingFlora.kegunaan,
        photos: updatedPhotos
      },
      { new: true }
    );

    res.json(updatedFlora);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/flora/:floraId/photo/:photoIndex', async (req, res) => {
  try {
    const { floraId, photoIndex } = req.params;

    // Find the flora document
    const floras = await flora.findById(floraId);
    if (!floras) {
      return res.status(404).json({ message: 'Flora not found' });
    }

    // Convert photoIndex to an integer
    const index = parseInt(photoIndex, 10);
    if (isNaN(index) || index < 0 || index >= floras.photos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }

    // Remove the photo from the array
    floras.photos.splice(index, 1);

    // Save the updated document
    await floras.save();

    res.status(200).json({ message: 'Photo deleted successfully', flora });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/api/flora/:id', async (req, res) => {
  try {
    const deletedFlora = await flora.findByIdAndDelete(req.params.id);

    if (!deletedFlora) {
      return res.status(404).json({ error: 'Flora not found' });
    }

    res.json({ message: 'Flora deleted successfully', deletedFlora });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/getLazyFauna', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 6);
    const total = await fauna.countDocuments();

    const faunaData = await fauna.find()
      .sort({ _id: -1 }) // Sort newest first
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ faunaData, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/getAllFauna', async (req, res) => {
  try {
    const faunaData = await fauna.find();
    res.json(faunaData);
  } catch (error) {
    console.error('Error fetching fauna data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getPartialFauna', async (req, res) => {
  try {
    // Fetch only 5 documents and select specific fields
    const faunaData = await fauna.find({}, {
      name: 1,
      short_description: 1,
      nameIlmiah: 1,
      photos: { $slice: 1 } // Fetch only the first photo
    }).limit(5);

    res.json(faunaData);
  } catch (error) {
    console.error('Error fetching fauna data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLoadFauna', async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    // Validate and sanitize the page and limit values
    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the fauna data with pagination and specific fields
    const faunaData = await fauna.find({}, {
      name: 1,
      nameIlmiah: 1,
      short_description: 1,
      photos: { $slice: 1 } // Only include the first photo
    })
      .skip(skip)
      .limit(limit)
      .collation({ locale: 'en', strength: 1 }); // Optional: adjust collation for better performance

    res.json(faunaData);
  } catch (error) {
    console.error('Error fetching fauna data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/fauna', upload.array('photos', 3), async (req, res) => {
  try {
    // Get the highest current 'no' and increment it
    const lastFauna = await fauna.findOne().sort({ no: -1 });
    const nextNo = lastFauna ? lastFauna.no + 1 : 1; // Start from 1 if no entries exist

    // Extract images
    const photos = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    // Create new fauna entry
    const newFauna = new fauna({
      name: req.body.name,
      nameIlmiah: req.body.nameIlmiah,
      description: req.body.description,
      short_description: req.body.description, // Ensuring both fields are identical
      category: req.body.category,
      habitat: req.body.habitat,
      panjang: req.body.panjang,
      lebar: req.body.lebar,
      warna: req.body.warna,
      makanan: req.body.makanan,
      reproduksi: req.body.reproduksi,
      adaptasi: req.body.adaptasi,
      gerakan: req.body.gerakan,
      alatGerak: req.body.alatGerak,
      bentukTubuh: req.body.bentukTubuh,
      no: nextNo,
      photos: photos
    });

    // Save to database
    const savedFauna = await newFauna.save();
    res.json(savedFauna);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing fauna entry
app.put('/api/fauna/:id', upload.array('photos', 3), async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing fauna entry
    const existingFauna = await fauna.findById(id);
    if (!existingFauna) {
      return res.status(404).json({ error: 'Fauna not found' });
    }

    // Keep existing photos if none are uploaded
    let updatedPhotos = existingFauna.photos;
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
      updatedPhotos = [...existingFauna.photos, ...newPhotos]; // Append new photos
    }

    // Generate short description (25% of descriptions)
    const fullDescription = req.body.description || existingFauna.description;
    const words = fullDescription.split(" ");
    const shortDescLength = Math.ceil(words.length * 0.25);
    const shortDescription = words.slice(0, shortDescLength).join(" ");

    // Update the fauna entry
    const updatedFauna = await fauna.findByIdAndUpdate(
      id,
      {
        name: req.body.name || existingFauna.name,
        nameIlmiah: req.body.nameIlmiah || existingFauna.nameIlmiah,
        description: fullDescription,
        short_description: shortDescription,
        category: req.body.category || existingFauna.category,
        habitat: req.body.habitat || existingFauna.habitat,
        panjang: req.body.panjang || existingFauna.panjang,
        lebar: req.body.lebar || existingFauna.lebar,
        warna: req.body.warna || existingFauna.warna,
        makanan: req.body.makanan || existingFauna.makanan,
        reproduksi: req.body.reproduksi || existingFauna.reproduksi,
        adaptasi: req.body.adaptasi || existingFauna.adaptasi,
        gerakan: req.body.gerakan || existingFauna.gerakan,
        alatGerak: req.body.alatGerak || existingFauna.alatGerak,
        bentukTubuh: req.body.bentukTubuh || existingFauna.bentukTubuh,
        photos: updatedPhotos
      },
      { new: true }
    );

    res.json(updatedFauna);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific photo from a fauna entry
app.delete('/api/fauna/:faunaId/photo/:photoIndex', async (req, res) => {
  try {
    const { faunaId, photoIndex } = req.params;

    // Find the fauna document
    const faunas = await fauna.findById(faunaId);
    if (!faunas) {
      return res.status(404).json({ message: 'Fauna not found' });
    }

    // Convert photoIndex to an integer
    const index = parseInt(photoIndex, 10);
    if (isNaN(index) || index < 0 || index >= faunas.photos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }

    // Remove the photo from the array
    faunas.photos.splice(index, 1);

    // Save the updated document
    await faunas.save();

    res.status(200).json({ message: 'Photo deleted successfully', fauna: faunas });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete an entire fauna entry
app.delete('/api/fauna/:id', async (req, res) => {
  try {
    const deletedFauna = await fauna.findByIdAndDelete(req.params.id);

    if (!deletedFauna) {
      return res.status(404).json({ error: 'Fauna not found' });
    }

    res.json({ message: 'Fauna deleted successfully', deletedFauna });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getAllBerita', async (req, res) => {
  try {
    const beritaData = await berita.find();
    res.json(beritaData);
  } catch (error) {
    console.error('Error fetching berita data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getPartialBerita', async (req, res) => {
  try {
    // Fetch only 5 documents and select specific fields
    const beritaData = await berita.find({}, {
      title: 1,
      short_description: 1,
      date: 1,
      photos: { $slice: 1 }
    }).limit(5);

    res.json(beritaData);
  } catch (error) {
    console.error('Error fetching berita data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLoadBeritas', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const beritas = await berita.find()
      .skip(skip)
      .limit(limit);

    const totalCount = await berita.countDocuments();

    res.json({
      beritas,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching beritas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLazyBerita', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 6);
    const total = await berita.countDocuments();

    const beritaData = await berita.find()
      .sort({ _id: -1 }) // Sort newest first
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ beritaData, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.post('/api/berita', upload.single('photo'), async (req, res) => {
//   try {
//     const lastBerita = await berita.findOne().sort({ no: -1 });
//     const nextNo = lastBerita ? lastBerita.no + 1 : 1;

//     let photo = null;
//     if (req.file) {
//       photo = {
//         data: req.file.buffer,
//         contentType: req.file.mimetype
//       };
//     }

//     const newBerita = new berita({
//       title: req.body.title,
//       description: req.body.description,
//       short_description: req.body.description,
//       date: req.body.date,
//       no: nextNo,
//       photos: photo ? [photo] : []
//     });

//     const savedBerita = await newBerita.save();
//     res.json(savedBerita);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.put('/api/berita/:id', upload.array('photos', 3), async (req, res) => {
  try {
    const { id } = req.params;
    const existingBerita = await berita.findById(id);
    if (!existingBerita) {
      return res.status(404).json({ error: 'Berita not found' });
    }

    let photos = req.body.photos; // Get photos from request body if available

    // Handle photos update logic
    if (Array.isArray(photos) && photos.length === 0) {
      console.log('Empty photos array, not updating photos.');
      photos = undefined; // Do not update if empty array
    }

    if (!req.files.length && !photos) {
      photos = undefined; // Ensure photos aren't updated if no files or base64 are provided
    }

    // Convert uploaded files to buffer
    if (req.files.length > 0) {
      photos = req.files.map(file => ({
        contentType: file.mimetype,
        data: file.buffer
      }));
    } else if (photos && photos.data && photos.data.$binary) {
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(photos.data.$binary.base64, 'base64');
      photos = [{
        contentType: photos.contentType,
        data: imageBuffer
      }];
    }

    // Generate short description
    const fullDescription = req.body.description || existingBerita.description;
    const words = fullDescription.split(" ");
    const shortDescLength = Math.ceil(words.length * 0.25);
    const shortDescription = words.slice(0, shortDescLength).join(" ");

    // Prepare update data, only setting fields if they exist
    const updateData = {
      title: req.body.title || existingBerita.title,
      description: fullDescription,
      short_description: shortDescription,
      date: req.body.date || existingBerita.date,
      photos: photos ? photos : undefined
    };

    // Remove undefined fields to prevent unwanted overwrites
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Update berita in the database
    const updatedBerita = await berita.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBerita) {
      return res.status(404).json({ error: 'Berita not found' });
    }

    res.json(updatedBerita);
  } catch (error) {
    console.error('Error updating berita:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


app.delete('/api/berita/:id', async (req, res) => {
  try {
    const deletedBerita = await berita.findByIdAndDelete(req.params.id);

    if (!deletedBerita) {
      return res.status(404).json({ error: 'Berita not found' });
    }

    res.json({ message: 'Berita deleted successfully', deletedBerita });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/berita', upload.array('photos', 3), async (req, res) => {
  try {
    const lastBerita = await berita.findOne().sort({ no: -1 });
    const nextNo = lastBerita ? lastBerita.no + 1 : 1;

    const photos = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    const newBerita = new berita({
      title: req.body.title,
      description: req.body.description,
      short_description: req.body.description, // Using full description for short_description initially
      date: req.body.date,
      no: nextNo,
      photos: photos
    });

    const savedBerita = await newBerita.save();
    res.json(savedBerita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.put('/api/berita/:id', upload.single('photo'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existingBerita = await berita.findById(id);
//     if (!existingBerita) {
//       return res.status(404).json({ error: 'Berita not found' });
//     }

//     let updatedPhoto = existingBerita.photos;
//     if (req.file) {
//       updatedPhoto = [{
//         data: req.file.buffer,
//         contentType: req.file.mimetype
//       }];
//     }

//     const fullDescription = req.body.description || existingBerita.description;
//     const words = fullDescription.split(" ");
//     const shortDescLength = Math.ceil(words.length * 0.25);
//     const shortDescription = words.slice(0, shortDescLength).join(" ");

//     const updatedBerita = await berita.findByIdAndUpdate(
//       id,
//       {
//         title: req.body.title || existingBerita.title,
//         description: fullDescription,
//         short_description: shortDescription,
//         date: req.body.date || existingBerita.date,
//         photos: updatedPhoto
//       },
//       { new: true }
//     );

//     res.json(updatedBerita);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Update a learning module
app.put('/api/learningModules/:id', upload.array('photos', 3), async (req, res) => {
  try {
    const { id } = req.params;
    const existingModule = await learningModule.findById(id);
    if (!existingModule) {
      return res.status(404).json({ error: 'Learning Module not found' });
    }

    let photos = req.body.photos;
    if (Array.isArray(photos) && photos.length === 0) {
      photos = undefined;
    }
    if (!req.files.length && !photos) {
      photos = undefined;
    }
    if (req.files.length > 0) {
      photos = req.files.map(file => ({
        contentType: file.mimetype,
        data: file.buffer
      }));
    } else if (photos && photos.data && photos.data.$binary) {
      const imageBuffer = Buffer.from(photos.data.$binary.base64, 'base64');
      photos = [{
        contentType: photos.contentType,
        data: imageBuffer
      }];
    }

    const updateData = {
      title: req.body.title || existingModule.title,
      description: req.body.description || existingModule.description,
      category: req.body.category || existingModule.category,
      url: req.body.url || existingModule.url,
      tags: req.body.tags || existingModule.tags,
      date: req.body.date || existingModule.date,
      photos: photos ? photos : undefined
    };

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedModule = await learningModule.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedModule);
  } catch (error) {
    console.error('Error updating learning module:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/learningModules/:id', async (req, res) => {
  try {
    const module = await learningModule.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Learning Module not found' });
    }
    res.json(module);
  } catch (error) {
    console.error('Error fetching learning module:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a learning module
app.delete('/api/learningModules/:id', async (req, res) => {
  try {
    const deletedModule = await learningModule.findByIdAndDelete(req.params.id);
    if (!deletedModule) {
      return res.status(404).json({ error: 'Learning Module not found' });
    }
    res.json({ message: 'Learning Module deleted successfully', deletedModule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new learning module
app.post('/api/learningModules', upload.array('photos', 3), async (req, res) => {
  try {
    const photos = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    const newModule = new learningModule({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      url: req.body.url,
      tags: req.body.tags,
      date: req.body.date,
      photos: photos
    });

    const savedModule = await newModule.save();
    res.json(savedModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get paginated learning modules
app.get('/api/getLazyLearningModules', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 6);
    const total = await learningModule.countDocuments();

    const modules = await learningModule.find()
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ modules, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Flora
app.get('/api/search/flora', async (req, res) => {
  const query = req.query.query || '';
  try {
    const results = await flora.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { nameIlmiah: new RegExp(query, 'i') }
      ]
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching Flora:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search Fauna
app.get('/api/search/fauna', async (req, res) => {
  const query = req.query.query || '';
  try {
    const results = await fauna.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { nameIlmiah: new RegExp(query, 'i') }
      ]
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching Fauna:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the required fields are present
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const isUseremail = await user.findOne({ email });
    if (isUseremail) {
      return res.status(400).json({ message: 'E-mail already in use' });
    }
    const isUsername = await user.findOne({ username });
    if (isUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Create a new user
    const newUser = new user({
      username,
      email,
      password,
      photos: [{
        contentType: "",
        data: ""
      }],
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user is in the admin database
  const foundAdmin = await admin.findOne({ username });
  if (foundAdmin) {
    // If the admin is found, check the password (no bcrypt comparison)
    if (foundAdmin.password !== password) {
      return res.status(400).json({ message: 'Invalid admin password credentials' });
    }

    // Generate token with admin role and include username and email
    const token = jwt.sign(
      {
        id: foundAdmin._id,
        username: foundAdmin.username, // Add username
        email: foundAdmin.email,       // Add email
        role: 'admin'                  // Add role
      },
      'Secret', // Use your own secret
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }

  // If the user is not an admin, check the regular user database
  const foundUser = await user.findOne({ username });
  if (!foundUser) {
    return res.status(400).json({ message: 'Invalid Username credentials' });
  }

  // Compare password directly (no bcrypt comparison)
  if (foundUser.password !== password) {
    return res.status(400).json({ message: 'Invalid Password credentials' });
  }

  // Generate token for regular user and include username and email
  const token = jwt.sign(
    {
      id: foundUser._id,
      username: foundUser.username, // Add username
      email: foundUser.email,       // Add email      
    },
    'Secret',
    { expiresIn: '1h' }
  );

  res.json({ token });
});

app.get('/users/:username', async (req, res) => {
  const username = req.params.username;

  try {
    // Check in users collection
    let userData = await user.findOne({ username: username });
    
    // If not found in users, check in admins
    if (!userData) {
      userData = await admin.findOne({ username: username });
    }

    // If still not found, return 404
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userData);  // Send user/admin data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 6;
    const skip = (page - 1) * pageSize;

    const users = await user.find().skip(skip).limit(pageSize);
    const totalUsers = await user.countDocuments();
    const totalPages = Math.ceil(totalUsers / pageSize);

    res.json({ usersData: users, totalPages });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/users', upload.array('photos', 1), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user with same username or email already exists
    const existingUser = await user.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }

    // Check if files exist before mapping
    const photos = req.files?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    })) || [];

    const newUser = new user({ // Ensure 'User' is correctly capitalized
      username,
      email,
      password,
      photos
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});


app.put('/api/users/:id', upload.array('photos', 3), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.params.id;

    // Find existing user
    const oldUser = await user.findById(userId);
    if (!oldUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let photos = req.body.photos; // Get photos from request body if available

    // Handle photos update logic
    if (Array.isArray(photos) && photos.length === 0) {
      console.log('Empty photos array, not updating photos.');
      photos = undefined; // Do not update if empty array
    }

    if (!req.files.length && !photos) {
      photos = undefined; // Ensure photos aren't updated if no files or base64 are provided
    }

    // Convert uploaded files to buffer
    if (req.files.length > 0) {
      photos = req.files.map(file => ({
        contentType: file.mimetype,
        data: file.buffer
      }));
    } else if (photos && photos.data && photos.data.$binary) {
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(photos.data.$binary.base64, 'base64');
      photos = [{
        contentType: photos.contentType,
        data: imageBuffer
      }];
    }

    // Prepare update data, only setting fields if they exist
    const updateData = {
      username,
      email,
      password,
      photos: photos ? photos : undefined
    };

    // Remove undefined fields to prevent unwanted overwrites
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Update user in the database
    const updatedUser = await user.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user', details: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Validate userId before proceeding
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find and delete user
    const deletedUser = await user.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user', details: error.message });
  }
});

app.get('/all-usernames', async (req, res) => {
  try {
      const users = await user.find({}, 'username photos');
      const admins = await admin.find({}, 'username photos');

      const allUsers = [...users, ...admins]; // Merge both collections

      res.status(200).json(allUsers);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching usernames', error });
  }
});

app.post('/api/post', upload.array('photos', 5), async (req, res) => {
  try {
    // Map uploaded files to the pictures array with `data` and `contentType`.
    const photos = req.files.map(file => ({ data: file.buffer, contentType: file.mimetype }));

    // Create a new post document based on the schema.
    const newPost = new post({
      username: req.body.username,
      description: req.body.description || '',
      like: [], // Default value for likes.    
      dislike: [], // Default value for likes.  
      comments: [], // Empty array for initial comments.
      photos: photos
    });

    // Save the new post to the database.
    const savedPost = await newPost.save();

    // Send the saved post back as the response.
    res.json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/post/:id', async (req, res) => {
  try {
    const deletedPost = await post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getLazyPosts', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 20);
    const total = await post.countDocuments();

    const postData = await post.find()
      .sort({ _id: -1 }) // Sort newest first
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ postData, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.put('/api/post/:id', upload.array('photos', 3), async (req, res) => {
  try {
    const { id } = req.params;
    const existingPost = await post.findById(id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    let photos = req.body.photos;

    // Handle photos update logic
    if (Array.isArray(photos) && photos.length === 0) {
      console.log('Empty photos array, not updating photos.');
      photos = undefined;
    }

    if (!req.files.length && !photos) {
      photos = undefined;
    }

    // Convert uploaded files to buffer
    if (req.files.length > 0) {
      photos = req.files.map(file => ({
        contentType: file.mimetype,
        data: file.buffer
      }));
    } else if (photos && photos.data && photos.data.$binary) {
      const imageBuffer = Buffer.from(photos.data.$binary.base64, 'base64');
      photos = [{
        contentType: photos.contentType,
        data: imageBuffer
      }];
    }

    // Prepare update data
    const updateData = {
      description: req.body.description || existingPost.description,
      photos: photos ? photos : undefined
    };

    // Remove undefined fields to prevent unwanted overwrites
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Update post in the database
    const updatedPost = await post.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// app.get('/post', async (req, res) => {
//   try {
//     const username = req.query.username;

//     // Validate username
//     if (!username) {
//       return res.status(400).json({ error: 'Username is required.' });
//     }

//     // Find posts by username
//     const posts = await post.find({ username: username });
//     res.json(posts);
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post('/api/like-post', async (req, res) => {
  const { postId, username } = req.body;

  try {
    const posts = await post.findById(postId);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Remove user from dislike if they exist
    posts.dislike = posts.dislike.filter((dislike) => dislike.username !== username);

    const likeIndex = posts.like.findIndex((like) => like.username === username);
    if (likeIndex === -1) {
      posts.like.push({ username });
    } else {
      posts.like.splice(likeIndex, 1);
    }

    await posts.save();
    res.status(200).json({ message: 'Like toggled successfully.', likes: posts.like });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.post('/api/dislike-post', async (req, res) => {
  const { postId, username } = req.body;

  try {
    const posts = await post.findById(postId);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Remove user from like if they exist
    posts.like = posts.like.filter((like) => like.username !== username);

    const dislikeIndex = posts.dislike.findIndex((dislike) => dislike.username === username);
    if (dislikeIndex === -1) {
      posts.dislike.push({ username });
    } else {
      posts.dislike.splice(dislikeIndex, 1);
    }

    await posts.save();
    res.status(200).json({ message: 'Dislike toggled successfully.', dislikes: posts.dislike });
  } catch (error) {
    console.error('Error toggling dislike:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


app.post('/api/add-comment', async (req, res) => {
  const { postId, username, comment } = req.body;

  try {
    const posts = await post.findById(postId);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Add the new comment
    posts.comments.push({ username, comment });

    await posts.save();
    res.status(200).json({ message: 'Comment added successfully.', comments: posts.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.get("/api/getQuiz", async (req, res) => {
  try {
      const newquiz = await quiz.findOne(); // Fetch the first available quiz
      if (!newquiz) {
          return res.status(404).json({ message: "No quiz found" });
      }
      res.json(newquiz);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});

// Create or update the quiz
app.post("/api/quiz", async (req, res) => {
  try {
      let newquiz = await quiz.findOne();
      if (newquiz) {
          newquiz.title = req.body.title;
          newquiz.questions = req.body.questions;
      } else {
          newquiz = new quiz(req.body);
      }
      await newquiz.save();
      res.json(newquiz);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Submit quiz result
app.post("/api/quiz/result", async (req, res) => {
  try {
      const { username, score } = req.body;

      let quizs = await quiz.findOne();
      if (!quizs) {
          return res.status(404).json({ error: "Quiz not found" });
      }

      quizs.result.push({ username, score });
      await quizs.save();
      res.json({ message: "Result submitted", result: quizs.result });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Get all results
app.get("/api/quiz/results", async (req, res) => {
  try {
      const quizs = await quiz.findOne();
      if (!quizs) {
          return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quizs.result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete the quiz
app.delete("/api/quiz", async (req, res) => {
  try {
      await quiz.deleteMany();
      res.json({ message: "Quiz deleted" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.delete("/api/reset", async (req, res) => {
  try {
      await quiz.deleteMany({}); // Clears all quiz data
      res.status(200).json({ message: "Quiz has been reset." });
  } catch (error) {
      res.status(500).json({ error: "Failed to reset quiz." });
  }
});

app.get('/api/events', async (req, res) => {
  try {
      const events = await event.find().sort({ startDate: 1 });
      res.status(200).json(events);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
  }
});

// Add a new event
app.post('/api/events', async (req, res) => {
  try {
      const { name, note, startDate, endDate, createdBy } = req.body;

      if (!name || !startDate || !createdBy) {
          return res.status(400).json({ message: 'Event name, start date, and creator are required' });
      }

      const newEvent = new event({ name, note, startDate, endDate, createdBy });
      await newEvent.save();

      res.status(201).json({ message: 'Event added successfully', event: newEvent });
  } catch (error) {
      res.status(500).json({ message: 'Error adding event', error });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
      const eventId = req.params.id;
      await event.findByIdAndDelete(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting event', error });
  }
});

app.get('/report', async (req, res) => {
  try {
      const reports = await report.find();
      res.json(reports);
  } catch (error) {
      res.status(500).json({ message: "Error fetching reports", error });
  }
});

// Add a new report
app.post('/report', async (req, res) => {
  const { username, description } = req.body;

  if (!username || !description) {
      return res.status(400).json({ message: "Username and description are required" });
  }

  try {
      const newReport = new report({ username, description });
      const savedReport = await newReport.save();
      res.status(201).json(savedReport);
  } catch (error) {
      res.status(500).json({ message: "Error adding report", error });
  }
});

// Delete a report by ID
app.delete('/report/:id', async (req, res) => {
  try {
      const deletedReport = await report.findByIdAndDelete(req.params.id);
      if (!deletedReport) {
          return res.status(404).json({ message: "Report not found" });
      }
      res.json({ message: "Report deleted", deletedReport });
  } catch (error) {
      res.status(500).json({ message: "Error deleting report", error });
  }
});

// Handle all other requests to serve the Angular frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Pastikan path ini benar
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
