import React, { memo, useContext, useEffect} from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom"
import index from "../Pages/index"

export default function Routers(){
    return(
        <Router>
            <Layout>
                <Switch>
                  <Route path="/" exact render={() => <index />} />
                </Switch>
            </Layout>
        </Router>
    )
}