import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import './Home.css'

const Home = () => {
    return (
        <Container style={{ maxWidth: '8in', padding: 0 }}>
            <Paper>
                <Body />
            </Paper>
        </Container>
    )
}

const Paragraph = ({ children }) => {
    return (
        <Box px={2} py={1}><Typography>{children}</Typography></Box>
    )
}

const Caption = ({ children }) => {
    return (
        <Box px={4} pb={5}><Typography><i>{children}</i></Typography></Box>
    )
}

const Subtitle = ({ children }) => {
    return (
        <Box px={2} pb={1}><Typography variant="h4">{children}</Typography></Box>
    )
}

const Body = () => (
    <div>
        <img src="/home/titlebild.jpg" alt="Balloon Over Snow" width="100%" />
        <Paragraph>
            The Ballometer is a sensor box for hot air balloons.
            It allows pilots to measure and log flight data such as GPS position and velocity, barometric altitude and vertical speed, relative humidity and more.
            The measurements are stored on the device and if you connect it to the internet via a mobile phone wifi hot spot, it will send the measurements to <a href="https://www.ballometer.io">www.ballometer.io</a>.
            Like this your friends can track you in real time.
            The flight measurements are archived online and ordered by date.
            This allows you to share memories of old flight with others in the future.
        </Paragraph>

        <Paragraph>
            I started working on this electronics project because I wanted to understand better how environmental parameters such as air humidity or solar irradiation influence fuel consumption.
            In the ballooning community people make strong statements about this but I could not find any studies.
            I am interested in quantifying the different effects such that maybe one can build more efficient hot air balloons in the future.
            The Ballometer might help providing the relevant data for this.
        </Paragraph>

        <img src="/home/overview-sketch.png" width="400px" alt="Overview Sketch" />

        <Caption>
            The Ballometer has a GPS module to log position and horizontal speed.
            A barometric pressure sensor allows to measure the altitude and vertical speed.
            The ambient air temperature and relative humidity are measured by a further sensor.
            A solar irradiation sensor measures how much power the sun provides.
            Since the sensitivity of this sensor depends on the incidence angle, a compass measures the box orientation.
            The compass comes together with an acceleration sensor which might capture the changes in vertical velocity.
            To know whether the burner is on or off, a microphone measures the sound volume.
        </Caption>

        <img src="/home/oliver.jpg" width="200px" alt="Oliver Wipfli" style={{ borderRadius: '50%' }} />

        <Caption>
            My name is Oliver Wipfli and I live in Zürich, Switzerland.
            I studied physics and am currently doing a PhD in the same field.
            I became a hot air balloon pilot in 2011 and since then flying balloons is my hobby.
        </Caption>

        <Paragraph>
            A small display and a few buttons allow the pilot to connect the Ballometer to a wifi hot spot of a mobile phone.
            The measurements are presented on a website that can be opened by any device in the same wifi network.
            All you have to do to see the data is open up the website in a browser and no installation of further apps on a tablet or mobile phone is required.
            When mobile data is available, the Ballometer will stream the measurements to www.ballometer.io and others can track your flight in real time.
        </Paragraph>

        <img src="/home/wifi-sketch.png" width="500px" alt="Wifi Sketch" />

        <Caption>
            To connect the Ballometer first create a wifi hot spot with your mobile phone (A).
            Then enter the wifi password on the Ballometer with the buttons (B).
            The password will be stored permanently.
            If the Ballometer is connected to the wifi network, it displays its local IP address (C).
            Type this IP in a browser’s address bar of a tablet or mobile phone which is in the same wifi network and you will get to the local, offline website hosted by the Ballometer (D).
            If there is an internet connection, the measurements are sent to <a href="https://www.ballometer.io">www.ballometer.io</a> and the chase crew can track the balloon in real time (E).
        </Caption>

        <Paragraph>
            The Ballometer box is small enough to be mounted on a burner support by a Velcro strap.
            The housing has to be big enough to hold a 10000 mAh power bank which has typically the size of a large mobile phone.
        </Paragraph>

        <img src="/home/size-and-mounting.png" width="350px" alt="Size and Mounting" />

        <Paragraph>
            For navigation purposes the Ballometer website contains a map with the current balloon position, projected direction, and a flight track.
            The map covers the entire world and is based on roughly 55 gigabytes of OpenStreetMap data which is stored in the Ballometer.
        </Paragraph>

        <img src="/home/map-screenshot.jpg" width="100%" alt="Map Screenshot" />

        <Caption>
            The online map shows the flight track and some live measurements which are useful for the chase crew to retrieve the balloon.
            The Ballometer hosts the same map and the pilot can access it over wifi even when there is no internet connection.
            Map data from OpenStreetMap for the entire world will be saved on the Ballometer, which requires roughly 55 gigabytes of storage.
        </Caption>

        <img src="/home/burner.jpg" width="300px" alt="Burner" />

        <Caption>
            A microphone measures the sound volume to record burner activity.
        </Caption>

        <Paragraph>
            All measurements are stored locally on the Ballometer and the measurement history is available to the pilot even without an internet connection.
            The online website also stores the measurements and presents them for future use ordered by flights.
            All data sent to the website is open for everyone without access restrictions - pilots can however delete flights from the website.
        </Paragraph>

        <img src="/home/charts-screenshot.PNG" width="100%" alt="Charts Screenshot" />

        <Caption>
            A website presents the measurement history in charts where the horizontal axis is time.
            Here shown is the local version that the pilot can access over wifi even without an internet connection.
            A similar website is available online.
        </Caption>

        <img src="/home/morning-flight.jpg" width="350px" alt="Morning above wheat field" />

        <Caption>
            Morning light shortly after take-off for a test flight on 11.08.2019.
        </Caption>


        <Subtitle>Hardware Specifications</Subtitle>

        <Paragraph>
            <ul>
                <li>	GPS: UBlox Neo 7M, GNSS engine for GPS/QZSS, GLONASS.</li>
                <li>	Barometer: Bosch BMP280, absolute accuracy ±1 hPa, relative accuracy ±0.12 hPa (equivalent to 1 m), range 300 hPa to 1100 hPa (9000 m to -500 m AMSL).</li>
                <li>	Air temperature and humidity: Sensirion SHT31-D, accuracy ±0.3 deg C, ±2 % RH, temperature range -40 to 125 deg C</li>
                <li>	Solar irradiation: AMS TSL2591, range 188 uLux to 88000 Lux</li>
                <li>	Accelerometer and compass: ST LSM303AGR, acceleration sensitivity 10 mm/s2</li>
                <li>	Microphone: Mini USB Microphone</li>
                <li>	Single Board Computer: Raspberry Pi Model 3 B+</li>
                <li>	Power Bank: 10000 mAh, enough for 5 hours of recording</li>
            </ul>
        </Paragraph>

        <Subtitle>Software Technologies</Subtitle>

        <Paragraph>
            The operating system on the raspberry pi is raspbian light.
            Scripts written in python read out the sensors over serial and I2C and store the measurements in an influxdb time-series database.
            Adafruit libraries facilitate the communication with the sensors.
            Grafana presents the measurement history on a website and maptiler-gl delivers OpenStreetMap data.
            The web frontend is written in react and a node server runs in the backend.
            Ansible helps documenting and automating the configuration of the raspberry pi and also the online server.
        </Paragraph>

        <img src="/home/inflation.jpg" width="350px" alt="Envelope inflation" />

        <Caption>
            Inflation of the envelope on another test flight on the morning of 24.08.2019.
        </Caption>

        <Subtitle>Prototypes</Subtitle>

        <Paragraph>
            The idea of building something like the Ballometer was in my head for a long time.
            I remember that I wanted to make a website already in 2015 for logging a phone’s GPS data during a hot air balloon flight but never got very far with writing an android app.
            Later a friend of mine got an isolated envelope and we started discussing about fuel consumption.
            Especially during the night this balloon uses much less fuel than conventional ones.
            Many pilots think that this is related to the increased relative humidity during night, but I think it has rather to do with missing solar irradiation.
        </Paragraph>

        <img src="/home/panorama.jpg" width="450px" alt="Panorama of the alps" />

        <Caption>
            Good panorama view of the alps during a test flight on 01.06.2019.
        </Caption>


        <Paragraph>
            To test our theories, I built a little logging system in 2018 based on an Arduino that would record air humidity and other environmental parameters on an SD card.
            While this system worked in principle it was still a bit cumbersome to handle since one had to copy the files over to a PC by hand after every flight.
            Then, at the beginning of 2019, I thought it would be better to use an ESP8266, which is a wifi enabled microcontroller, such that one could look at the data in real time.
            I made a custom printed circuit board at EasyEDA and wrote quite some code for this but everything had to be written from scratch since it is a rather low level architecture.
            Then sometime in summer 2019 I decided to go for a raspberry pi and use a full Linux system.
            Now I was all of a sudden able to use databases like influxdb, write standard webservers in JavaScript and have my sensor logging scripts done in python.
            This was a big relief and made it also possible to serve a map locally without an internet connection.
        </Paragraph>

        <img src="/home/mdf-prototype.jpg" width="550px" alt="Prototype in a MDF box" />
        <Caption>
            The first prototype of the Ballometer based on a raspberry pi was built in July 2019.
            The housing was made of a laser-cut wooden MDF box and a transparent acrylic panel.
        </Caption>

        <Paragraph>
            In autumn 2019 I started the website <a href="https://www.ballometer.io">www.ballometer.io</a> and implemented a flight tracker.
            Most of the sensors worked immediately but the solar irradiation sensor still requires some work as the sensitivity depends on the angle between the sun and the sensor.
            I plan to compensate this by measuring the orientation of the sensor with a digital compass.
        </Paragraph>

        <img src="/home/wifi-prototype.jpg" width="450px" alt="LDC screen prototype for wifi" />
        <Caption>
            Connecting the raspberry pi to a wifi network using an LCD display and a few buttons was implemented and tested in September 2019.
        </Caption>

        <Paragraph>
            To make a plastic box I started experimenting with 3D printing in November 2019.
            Although this technique is a bit slow, it is inexpensive and well suited for making a custom enclosure.
        </Paragraph>

        <img src="/home/3d-prototype.jpg" width="550px" alt="Prototype of 3D printing" />
        <Caption>
            To come away from wooden boxes a 3D printer (left image) was used to make a small test box out of PLA plastic in November 2019.
        </Caption>

        <Subtitle>
            Schedule
        </Subtitle>

        <Paragraph>
            I would like to build a few Ballometers and sell them to other hot air balloon pilots.
            They will get a username for the ballometer.io website which is based on their family name, like for example <a href="https://ballometer.io/wipfli">ballometer.io/wipfli</a>.
            I am interested in collecting like this flight data under different conditions.
            In the future this data can be used to model the influence of the observed environmental parameters on fuel consumption.
        </Paragraph>

        <Paragraph>
            The schedule looks like this:
            <ul>
                <li>January 2020: Pilots can reserve a Ballometer.</li>
                <li>February 2020: Order components.</li>
                <li>March 2020: Design a custom PCB for the sensors, the buttons and the display, and make a 3D printed box. </li>
                <li>July 2020: Finish the software implementation.</li>
                <li>August 2020: Build and ship the devices to the pilots.</li>
            </ul>
        </Paragraph>

        <Subtitle>
            Budget
        </Subtitle>


        <Paragraph>
            The Ballometer is based on inexpensive and mass produced components and AliExpress sells most of them.
            The official Raspberry Pi reseller for Switzerland says that the Model 3B+ will only be available in June 2020, but maybe I can receive some before this date from another distributor.
        </Paragraph>

        <Paragraph>
            The following table gives an estimate of the material cost:
        </Paragraph>

        <Box p={5}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Component</TableCell>
                            <TableCell>Lead Time</TableCell>
                            <TableCell>Price (CHF)</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow><TableCell>Raspberry Pi Model 3 B+</TableCell><TableCell>09.06.2020</TableCell><TableCell>40</TableCell></TableRow>
                        <TableRow><TableCell>SHT 31 Temperature Sensor</TableCell><TableCell>60 days</TableCell><TableCell>3</TableCell></TableRow>
                        <TableRow><TableCell>LSM303 Compass</TableCell><TableCell>60 days</TableCell><TableCell>3</TableCell></TableRow>
                        <TableRow><TableCell>TSL2591 Solar Irradiation Sensor</TableCell><TableCell>60 days</TableCell><TableCell>5</TableCell></TableRow>
                        <TableRow><TableCell>BMP280 Pressure Sensor</TableCell><TableCell>60 days</TableCell><TableCell>1</TableCell></TableRow>
                        <TableRow><TableCell>Mini USB Microphone</TableCell><TableCell>60 days</TableCell><TableCell>2</TableCell></TableRow>
                        <TableRow><TableCell>GPS UBlox Neo 7M</TableCell><TableCell>60 days</TableCell><TableCell>12</TableCell></TableRow>
                        <TableRow><TableCell>GPS Antenna</TableCell><TableCell>60 days</TableCell><TableCell>2</TableCell></TableRow>
                        <TableRow><TableCell>Buttons</TableCell><TableCell>60 days</TableCell><TableCell>1</TableCell></TableRow>
                        <TableRow><TableCell>LCD Display</TableCell><TableCell>60 days</TableCell><TableCell>4</TableCell></TableRow>
                        <TableRow><TableCell>SD Card 64 GB</TableCell><TableCell>60 days</TableCell><TableCell>15</TableCell></TableRow>
                        <TableRow><TableCell>Power Bank 10000 mAh</TableCell><TableCell>14 days</TableCell><TableCell>30</TableCell></TableRow>
                        <TableRow><TableCell>3D Printed Box</TableCell><TableCell>14 days</TableCell><TableCell>10</TableCell></TableRow>
                        <TableRow><TableCell>Velcro</TableCell><TableCell>14 days</TableCell><TableCell>2</TableCell></TableRow>
                        <TableRow><TableCell>Printed Circuit Board</TableCell><TableCell>14 days</TableCell><TableCell>3</TableCell></TableRow>
                        <TableRow><TableCell><b>Total</b></TableCell><TableCell></TableCell><TableCell><b>133</b></TableCell> </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

        <Paragraph>
            There will be a fee for the labor needed for assembly which is roughly CHF 50.
            Shipping is likely to cost another CHF 20.
            This will lead to an overall cost around CHF 200.
        </Paragraph>

        <Subtitle>
            Outlook
        </Subtitle>

        <Paragraph>
            Hot air balloons seem to be so simple systems that I belief it should be possible to model them with a high degree of precision.
            The Ballometer captures the main physical factors that determine the dynamics of a hot air balloon and it paves the way to a quantitative model of fuel consumption based on environmental parameters.
            I hope that a better understanding will lead to more efficient hot air balloons in the future.
        </Paragraph>

        <img src="/home/model-sketch.PNG" width="650px" alt="Equations and envelope sketch" />
        <Caption>
            A small set of equations determines the dynamics of a hot air balloon.
            Now measurement data is needed to test how strongly fuel consumption is influenced by the individual parameters.
        </Caption>

        <Paragraph>
            Besides these scientific ambitions I also just want to make pilots able to share their flights with friends. ]
            I am sure that having the flight history available online will invoke many good memories when looking at the tracks at a later point in time.
        </Paragraph>

        <img src="/home/landing.jpg" width="450px" alt="Balloon has landed on a road" />
        <Caption>
            Safe landing after the test flight on 24.08.2019.
        </Caption>


        <Subtitle>
            Contact
        </Subtitle>

        <Paragraph>
            If you have questions about the Ballometer feel free to contact me via the form on my ballooning website <a href="https://leichteralsluft.ch/#contact">https://leichteralsluft.ch/#contact</a>.
        </Paragraph>
    </div>
)

export default Home