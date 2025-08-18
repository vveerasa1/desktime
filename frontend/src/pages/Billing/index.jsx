import React from 'react'
import { Box,Button } from '@mui/material'
import PricingPlans from '../../components/Billings/Pricing'
import { useNavigate } from 'react-router-dom'
import ComparePlan from '../../components/Billings/ComparePlan'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const Billing = () => {
    const navigate = useNavigate()
  return (
    <Box>
        <Box>
            <Button onClick={()=>navigate('/dashboard')}><ArrowBackIcon/></Button>
        </Box>
      <PricingPlans/>
      <ComparePlan/>
    </Box>
  )
}

export default Billing
