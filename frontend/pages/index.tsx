import Head from 'next/head'
import LocationProofGenerator from '../components/LocationProofGenerator'

export default function Home() {
  return (
    <>
      <Head>
        <title>GeoPrivacy - Zero-Knowledge Location Proofs</title>
        <meta name="description" content="Generate secure, private location proofs" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LocationProofGenerator />
    </>
  )
}
