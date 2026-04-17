

import React from 'react'
import Footer from "../components/GlobalComponent/Footer";
import Navbar from "../components/GlobalComponent/Navbar";
import Contact from '../components/contact/contact';




function ContactPage() {
    return (
        <section className="py-24">
            <div className='container mx-auto px-6'>
                <Navbar />
                <Contact />
                <Footer />
            </div>
        </section>
    )
}

export default ContactPage;
