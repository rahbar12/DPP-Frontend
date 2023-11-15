import axios from "axios";
import { useEffect, useState } from "react";

const Main = ({token, setToken}) => {
    const [deliveryDVD, setDeliveryDVD] = useState([])
    const [pickupDVD, setPickupDVD] = useState([]);
    const [allDVD, setAllDVD] = useState([])
    const [search, setSearch] = useState("");
    const [deliveryName, setDeliveryName] = useState("")
    const [rent, setRent] = useState(0)
    const [rentDays, setRentDays] = useState(0)
    const [deliveryError, setDeliveryError] = useState("")
    const [pickupError, setPickupError] = useState("")
    const [deliveryCharges, setDeliveryCharges] = useState(0)

    useEffect(() => {
        axios.get('http://localhost:3000/api/delivered-dvds', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            params: {
                search
            }
        })
        .then(response => {
            setAllDVD(response.data.data)
        })
        .catch(error => {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setToken("");
            }
        })
    }, [search])

    const onAddPickup = (data) => {
        const match = pickupDVD.find((obj) => obj.id === data.id)
        if (match) return setPickupError("Item Already In List")
        setPickupDVD([...pickupDVD, data])
    } 
    const removePickup = (i) => {
        const newArray = [...pickupDVD]
        newArray.splice(i, 1)
        setPickupDVD(newArray);
    }
    const onSubmitPickup = async () => {
        if (!pickupDVD.length) return setPickupError("Please Select A DVD To Pickup");
        try {
            await axios.post('http://localhost:3000/api/create-pickup', { dvds: pickupDVD.map((obj) => obj.id) }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            window.location.reload()
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                return setToken("");
            };
            setPickupError(error.response.data.message)
        }
    }
    const onAdd = () => {
        if (!deliveryName) return setDeliveryError("Enter Name");
        if (!rent || rent <= 0) return setDeliveryError("Rent Must Be Greater Than Zero");
        if (!rentDays || rentDays <= 0) return setDeliveryError("Rent Days Must Be Greater Than Zero");
        if (!Number.isInteger(rentDays)) return setDeliveryError("Rent Days Must Be Integer");
        setDeliveryDVD([...deliveryDVD, {name: deliveryName, rent, rentDays}])
        setDeliveryError("");
    }
    const removeDelivery = (i) => {
        const newArray = [...deliveryDVD]
        newArray.splice(i, 1)
        setDeliveryDVD(newArray);
    }
    const onSubmit = async () => {
        if (!deliveryCharges || deliveryCharges < 0) return setDeliveryError("Delivery Charges Must Be Greater Than Zero");
        try {
            await axios.post('http://localhost:3000/api/create-delivery', { dvds: deliveryDVD, deliveryCharges }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            window.location.reload()
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                return setToken("");
            };
            setDeliveryError(error.response.data.message)
        }
    }
    return (
        <div style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", gap: "2%"}}>
            <div style={{ border: "2px solid white", borderRadius: "10px", width: "40%", boxShadow: "inset 0 0 20px 0 white", color: "white" }}>
                <form style={{display: "flex", flexDirection: "column"}}>
                    <h2 style={{padding:"5px"}}>Create Delivery</h2>
                    <label>DVD's Added: </label> 
                        {deliveryDVD.length 
                        ? 
                        <table style={{ borderCollapse: "separate", borderRadius: "10px", border: "2px solid white" }}>
                                <tbody>
                                {deliveryDVD.map((obj, i) => <tr style={{ margin: "1px", padding: "1px" }}><td>Name:</td> <td>{obj.name}</td> <td>Rent:</td> <td>{obj.rent}</td> <td>Rent Days:</td> <td>{obj.rentDays}</td> <span style={{color:"red", cursor: "pointer"}} onClick={() => removeDelivery(i)}>x</span></tr>)}
                                </tbody>
                            </table> 
                        : 
                        <div style={{ borderRadius: "10px", border: "2px solid white", margin: "1px", padding: "1px" }}>No Item</div>}
                    {deliveryError ? <span style={{color: "red"}}>{deliveryError}</span> : "" }
                    <table>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>:</td>
                                <td><input onInput={(e) => setDeliveryName(e.target.value)} /></td>
                            </tr>
                            <tr>
                                <td>Rent</td>
                                <td>:</td>
                                <td><input type="number" onInput={(e) => setRent(+e.target.value)} /></td>
                            </tr>
                            <tr>
                                <td>Rent Days</td>
                                <td>:</td>
                                <td><input type="number" step={1} onInput={(e) => setRentDays(+e.target.value)} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" onClick={onAdd} style={{ width: "25%", marginLeft: "auto", marginRight: "auto", marginBottom: "2%", marginTop: "2%" }}>Add</button>
                    <table>
                        <tbody>
                            <tr>
                                <td>Delivery Charges</td>
                                <td>:</td>
                                <td><input type="number" onInput={(e) => setDeliveryCharges(+e.target.value)} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" onClick={onSubmit} style={{ width: "30%", marginLeft: "auto", marginRight: "auto", marginBottom: "2%", marginTop: "2%" }}>Add Delivery</button>
                </form>
            </div>
            <div style={{ border: "2px solid white", borderRadius: "10px", width: "40%", boxShadow: "inset 0 0 20px 0 white", color: "white" }}>
                <form style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{ padding: "5px" }}>Create Pickup</h2>
                    <label>DVD's Added: </label>
                    {pickupDVD.length
                        ?
                        <table style={{ borderCollapse: "separate", borderRadius: "10px", border: "2px solid white" }}>
                            <tbody>
                                {pickupDVD.map((obj, i) => <tr style={{ margin: "1px", padding: "1px" }}><td>Name:</td> <td>{obj.name}</td> <td>Rent:</td> <td>{obj.rent}</td> <td>Rent Days:</td> <td>{obj.rentDays}</td> <span style={{ color: "red", cursor: "pointer" }} onClick={() => removePickup(i)}>x</span></tr>)}
                            </tbody>
                        </table>
                        :
                        <div style={{ borderRadius: "10px", border: "2px solid white", margin: "1px", padding: "1px" }}>No Item</div>}
                    {pickupError ? <span style={{ color: "red" }}>{pickupError}</span> : ""}
                    <table>
                        <tbody>
                            <tr>
                                <td>Search</td>
                                <td>:</td>
                                <td><input onInput={(e) => setSearch(e.target.value)} /></td>
                            </tr>
                        </tbody>
                    </table>
                    {allDVD.filter((obj) => !pickupDVD.find((data) => data.id === obj.id)).length ? <div style={{height: "200px", width: "100%", overflow: "scroll"}}>
                        <table style={{ borderCollapse: "separate", borderRadius: "10px", border: "2px solid white", width: "100%" }}>
                            <tbody>
                                {allDVD.map((obj) => {
                                    const match = pickupDVD.find((data) => data.id === obj.id);
                                    if (!match) return <tr style={{ border: "2px solid green", margin: "1px", padding: "1px", borderRadius: "10px", cursor: "pointer" }} onClick={() => onAddPickup(obj)}><td>Name:</td> <td>{obj.name}</td> <td>Rent:</td> <td>{obj.rent}</td> <td>Rent Days:</td> <td>{obj.rentDays}</td></tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                        : <div style={{ borderRadius: "10px", border: "2px solid white", margin: "1px", padding: "1px" }}>No Item</div>}
                    <button type="button" onClick={onSubmitPickup} style={{ width: "30%", marginLeft: "auto", marginRight: "auto", marginBottom: "2%", marginTop: "2%" }}>Add Pickup</button>
                </form>
            </div>
        </div>
    )
}

export default Main;