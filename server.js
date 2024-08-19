const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path')
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

// Sample data for the cover letter
const defaultData = {
    name: "Sheung Kit, Simon Chan",
    address: "Yonge–Eglinton, Toronto, ON M4P 0E3",
    email: "chansk3693@gmail.com",
    phone: "+1 (437) 838-4729",
    date: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
    company: "",
    location: "Toronto, ON",
    position: ""
};

let coverLetterData = {...defaultData}

// Create a route
app.get('/', (req, res) => {
   res.render('index', coverLetterData);
});

app.post('/save', (req, res) => {
    coverLetterData = { ...defaultData, ...req.body }; // Save data to preferences
    res.redirect('/');
});

app.get('/download-pdf', (req, res) => {
    if (Object.keys(coverLetterData).length === 0) {
        console.error('No data available to generate PDF');
        return res.status(400).send('No data available to generate PDF');
    }

    console.log('Generating PDF with data:', coverLetterData);

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'public', 'cover-letter.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(12)
        .text(`${coverLetterData.name}\n${coverLetterData.address}\nEmail: ${coverLetterData.email}\nCell: ${coverLetterData.phone}\n\n`)
        .text(`${coverLetterData.date}\n\n`)
        .text(`${coverLetterData.company}\n${coverLetterData.location}\n\n`)
        .text(`RE: ${coverLetterData.position}\n\n`)
        .text('Dear Hiring Manager,\n\n')
        .text(`I am writing to express my interest in the ${coverLetterData.position} position at ${coverLetterData.company}. With a strong background in web/mobile development, IT business analysis, and hands-on experience in the full Software Development Life Cycle (SDLC), I am assured my ability to contribute to your team and deliver innovative, high-quality mobile solutions.\n\n`)
        .text(`As a postgraduate student in Mobile Application Development and Strategy at George Brown College, I have successfully designed, developed, and deployed numerous mobile applications, ensuring they are user-centric, responsive, and scalable. My experience includes proficiency in programming languages such as Swift, Kotlin, and JavaScript, as well as frameworks like React Native and SwiftUI. Additionally, my extensive experience with Agile/Scrum methodologies allows me to collaborate effectively within cross-functional teams to deliver projects on time and within scope.\n\n`)
        .text(`In my previous role as an IT Business Analyst at Bank of China (Hong Kong), I played a key role in enhancing digital banking functionalities, which led to a 20% increase in user satisfaction. My ability to translate business needs into technical solutions, coupled with my strong analytical skills, enabled me to optimize mobile banking services, resulting in a 15% increase in adoption rates. I am confident that my technical expertise and commitment to excellence align with the goals of ${coverLetterData.company}, and I am eager to bring my skills to your development team.\n\n`)
        .text(`Thanks for your time and consideration. I\'d love a chance to learn more about this position and demonstrate how I can help ${coverLetterData.company} reach organizational goals. I believe my skills and motivation make me a great potential asset. I can be reached at ${coverLetterData.phone} or ${coverLetterData.email} if you need any other information.\n\n`)
        .text('Sincerely,\n')
        .text(coverLetterData.name);

    doc.end();

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err){
            console.log(`File does not exist while ${err}`)
            return res.status(500).send('Error generating PDF');
        }
        res.download(filePath, 'cover-letter.pdf', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error generating PDF');
            }
        });
    })
});


// Start the server
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`)
});
