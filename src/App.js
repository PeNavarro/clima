import React, { useState, useEffect } from 'react'
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
import Spinner from 'react-bootstrap/Spinner'
import Toast from 'react-bootstrap/Toast'
import Alert from 'react-bootstrap/Alert'

import { FaCloudversify, FaCloudRain, FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { ToastBody, ToastHeader } from 'react-bootstrap'

function App(){
  const [cidade, setCidade] = useState('')
  const [clima, setClima] = useState(null)
  const [obtendoClima, setObtendoClima] = useState(false)
  const [erro, setErro] = useState(null)
  const [erroGeo, setErroGeo] = useState(null)

  const listaErrosGeo = [
    {"Código":1, "texto":"Permisão de localização negada"},
    {"Código":2, "texto":"Não foi possível obter a localização"},
    {"Código":3, "texto":"O tempo de espera para obter a localização foi expirado!"}]

  useEffect(() =>{
    const apiGeo = process.env.REACT_APP_APIKEY_GEO
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(function (position){
        //console.log(position)
        obtemCidade(position.coords.latitude, position.coords.longitude)
      }, function (error){
        console.error(error)
        setErroGeo(error.code)
      })
    }
    async function obtemCidade(latitude, longitude){
      let url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiGeo}`
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        setCidade(data.results[0].components.city+', '+data.results[0].components.country)
      })
      .catch(function(error){
        console.error(`Não foi possível buscar a cidade a partir da lat/long. Erro ${error.message}`)
      })
    }
  }, [])

  async function obtemClima(cidade){
    setObtendoClima(true)
    const apiWeather = process.env.REACT_APP_APIKEY_WEATHER
    let urlClima = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt&units=metric&appid=${apiWeather}`
    await fetch(urlClima)
    .then(response => response.json())
    .then(
      data => {
        switch(data.cod){
          case '401':
            setErro("A API key informada é inválida")
            setClima(null)
          break
          
          case '404':
            setErro("A cidade inserida não foi encontrada")
            setClima(null)
            setCidade('')
          break

          case '429':
            setErro("O uso gratuito da API foi excedido (60 chamadas por minuto)")
            setClima(null)
          break

          default:
            setClima(data)
        }     
    })

    .catch(function(error){
      console.error(`Houve um erro ao consultar a API: ${error.message}`)
    })
    setObtendoClima(false)
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

          <Button onClick={() => {obtemClima(cidade)}} disabled={cidade.length < 3}> {/*Chamamos a função desse jeito pois se houvesse somente a obtemClima(cidade), a função seria disparada quando a página inicializasse por causa do parametro 'cidade' já estar setado com um valor*/} 
            {obtendoClima ? <Spinner size="sm" animation="border"/> : <FaCloudversify size="25"/>} 
            &nbsp;Obter Clima
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

      {erroGeo &&
        <div className="d-flex justify-content-center">
          <Alert variant="danger" onClose={()=>setErroGeo(null)} dismissible>
            <Alert.Heading>Ops! Ocorreu um erro ao obter sua localização.</Alert.Heading>
            <p>{listaErrosGeo[erroGeo].texto}</p>
          </Alert>
        </div>
      }

      {erro &&
        <div className="d-flex justify-content-center">
          <Toast onClose={() => setErro(null)} delay={4000} autohide>
            <ToastHeader>
              <strong className="mr-auto">{erro}</strong>
              <small className="mr-auto">🙄</small>
            </ToastHeader>
            <ToastBody className="text-danger">Por favor, faça uma nova busca.</ToastBody>
          </Toast>
        </div>
      }

      {obtendoClima &&
      <Row className="justify-content-center">
        <Spinner animation="border" variant="primary"></Spinner>
      </Row>
      }

      <Row className="justify-content-center">
        {clima &&
        <Card bg="secondary" className="text-center text-white">
          <Card.Header>
            <h2>{clima.name}</h2>
            <h3>{clima.main.temp}&#x2103;</h3>
            <h5><FaArrowDown/>Min: {clima.main.temp_min}&#x2103; &nbsp;&nbsp;&nbsp; <FaArrowUp/>Máx: {clima.main.temp_max}&#x2103;</h5>
          </Card.Header>
          <Card.Body>
            <Card.Img src={`http://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`} title={clima.weather[0].description}/>
            <Card.Title>{clima.weather[0].description}</Card.Title>
          </Card.Body>
          <Card.Footer>
            Atualizado em: {new Date(clima.dt*1000).toLocaleString('pt-BR', {timezone: "America/Sao_Paulo"})}
          </Card.Footer>
        </Card>
        }
      </Row>
    </>
  )
}

export default App