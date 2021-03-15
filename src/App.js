import React, { useState } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'

import { FaCloudversify, FaSpinner, FaCloudRain, FaArrowDown, FaArrowUp } from 'react-icons/fa'

function App(){
  const [cidade, setCidade] = useState('')
  const [clima, setClima] = useState(null)

  async function obtemClima(cidade){
    const apiWeather = process.env.REACT_APP_APIKEY
    let urlClima = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt&units=metric&appid=${apiWeather}`
    await fetch(urlClima)
    .then(response => response.json())
    .then(
      data => {
        console.log(data)
        setClima(data)
    })

    .catch(function(error){
      console.error(`Houve um erro ao consultar a API: ${error.message}`)
    })
  }

  return(
    <> {/*React Fragment (todo o código precisa estar dentro de um elemento pai, independente da tag)*/}
      <Navbar bg="secondary">
        
        <Navbar.Brand href="#inicio" className="text-white">FateClima</Navbar.Brand>

        <Nav className="mr-auto">

          <Nav.Link className="text-white" href="#inicio">Início</Nav.Link>

          <Nav.Link className="text-white" href="contato">Contato</Nav.Link>

        </Nav>

        <Form inline>

          <FormControl 
          type="text" 
          value={cidade}
          placeholder="Informe a cidade..." 
          onChange={e => setCidade(e.target.value)}
          />

          &nbsp;

          <Button onClick={() => {obtemClima(cidade)}}> {/*Chamamos a função desse jeito pois se houvesse somente a obtemClima(cidade), a função seria disparada quando a página inicializasse por causa do parametro 'cidade' já estar setado com um valor*/} 
            <FaCloudversify size="25"/> Obter Clima
          </Button>

        </Form>

      </Navbar>

      <Jumbotron>
        <FaCloudRain size="35"/><h1>FateClima</h1>
        <p>
          Consulte o clima de qualquer cidade do mundo!<br></br>

          <p className="text-italic">App desenvolvido em ReactJS e integrado a API OpenWeatherMap.</p>

        </p>
      </Jumbotron>
      <Row className="justify-content-center">
        {clima &&
        <Card bg="secondary" className="text-center text-white">
          <Card.Header>
            <h2>{clima.name}</h2>
            <h3>{clima.main.temp}&#x2103;</h3>
            <h5>Min: {clima.main.temp_min}&#x2103; &nbsp;&nbsp;&nbsp; Máx: {clima.main.temp_max}&#x2103;</h5>
          </Card.Header>
          <Card.Body>
            <Card.Title>Previsão do Tempo</Card.Title>
          </Card.Body>
          <Card.Footer>
            Atualizado em: 
          </Card.Footer>
        </Card>
        }
      </Row>
    </>
  )
}

export default App