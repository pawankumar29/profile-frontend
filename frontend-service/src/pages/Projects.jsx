import Footer from "../components/GlobalComponent/Footer";
import Navbar from "../components/GlobalComponent/Navbar";
import Hero_one from "../components/Projects/Hero_one";
import Hero_two from "../components/Projects/Hero_two";




import React from 'react'

function Projects() {
  return (
    <section className="py-24">
      <Navbar/>
      <Hero_one/>
      <Hero_two/>
      <Footer/>

    </section>
  )
}

export default Projects
