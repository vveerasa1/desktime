import React from 'react'
import { Box,Button } from '@mui/material'
import PricingPlans from '../../components/Billings/Pricing'
import { useNavigate } from 'react-router-dom'
const Billing = () => {
    const navigate = useNavigate()
  return (
    <Box>
        <Box>
            <Button onClick={()=>navigate('/dashboard')}>Back</Button>
        </Box>
      <PricingPlans/>
    </Box>
  )
}

export default Billing
