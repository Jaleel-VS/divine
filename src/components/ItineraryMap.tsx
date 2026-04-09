import { useEffect, useRef } from 'react'

const LOCATIONS: Record<string, [number, number]> = {
  windhoek: [-22.5609, 17.0658],
  sossusvlei: [-24.7275, 15.2993],
  'dead vlei': [-24.7392, 15.2928],
  'deadvlei': [-24.7392, 15.2928],
  'namib desert': [-24.7275, 15.2993],
  'namib': [-24.7275, 15.2993],
  etosha: [-18.8556, 16.3293],
  'etosha park': [-18.8556, 16.3293],
  'etosha national park': [-18.8556, 16.3293],
  swakopmund: [-22.6784, 14.5268],
  'skeleton coast': [-20.4, 13.2],
  walvis: [-22.9576, 14.5053],
  'walvis bay': [-22.9576, 14.5053],
  'fish river canyon': [-27.5917, 17.5417],
  'ai-ais': [-27.9167, 17.5167],
  keetmanshoop: [-26.5833, 18.1333],
  kolmanskop: [-26.7042, 15.2278],
  'luderitz': [-26.6481, 15.1591],
  'lüderitz': [-26.6481, 15.1591],
  kunene: [-17.2833, 13.9833],
  'epupa falls': [-17.0042, 13.2494],
  'epupa': [-17.0042, 13.2494],
  'sesriem': [-24.4833, 15.8333],
  'sesriem canyon': [-24.4833, 15.8333],
  'damaraland': [-20.5, 14.5],
  'spitzkoppe': [-21.8242, 15.2003],
  'twyfelfontein': [-20.5928, 14.3736],
  'waterberg': [-20.4167, 17.2333],
  'caprivi': [-18.0, 21.0],
  'brandberg': [-21.1333, 14.5667],
  'opuwo': [-18.0606, 13.8400],
}

function resolveCoords(title: string): [number, number] | null {
  const lower = title.toLowerCase()
  for (const [name, coords] of Object.entries(LOCATIONS)) {
    if (lower.includes(name)) return coords
  }
  return null
}

// Generate curved arc between two points
function curvedArc(a: [number, number], b: [number, number], segments = 20): [number, number][] {
  const midLat = (a[0] + b[0]) / 2
  const midLng = (a[1] + b[1]) / 2
  // Offset perpendicular to the line for the curve
  const dLat = b[0] - a[0]
  const dLng = b[1] - a[1]
  const offsetLat = midLat + dLng * 0.3
  const offsetLng = midLng - dLat * 0.3
  const points: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const lat = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * offsetLat + t * t * b[0]
    const lng = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * offsetLng + t * t * b[1]
    points.push([lat, lng])
  }
  return points
}

type Props = {
  itinerary: { day: number; title: string; description: string }[]
}

export default function ItineraryMap({ itinerary }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const stops = itinerary
    .map((item) => ({ ...item, coords: resolveCoords(item.title) }))
    .filter((s): s is typeof s & { coords: [number, number] } => s.coords !== null)

  useEffect(() => {
    if (!containerRef.current || stops.length === 0) return

    let cancelled = false
    let map: L.Map | null = null
    let loopTimer: ReturnType<typeof setTimeout>

    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([L]) => {
      if (cancelled || !containerRef.current) return

      map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map)
      map.setView([-22.0, 17.0], 6)
      map.setMaxBounds(L.latLngBounds([-29, 11], [-16, 26]))

      const layers: L.Layer[] = []
      const DELAY = 800
      const PAUSE = 2000

      function animate() {
        if (cancelled || !map) return
        // Clear previous layers
        layers.forEach((l) => map!.removeLayer(l))
        layers.length = 0

        stops.forEach((stop, i) => {
          const timers = setTimeout(() => {
            if (cancelled || !map) return

            const marker = L.marker(stop.coords, {
              icon: L.divIcon({
                className: '',
                html: `<div style="width:24px;height:24px;border-radius:50%;background:#b45309;border:2px solid #1c1917;color:#faf9f6;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;transform:scale(0);transition:transform 0.3s ease-out;">${stop.day}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              }),
            }).addTo(map!)
            layers.push(marker)

            requestAnimationFrame(() => {
              const icons = containerRef.current?.querySelectorAll<HTMLElement>('.leaflet-marker-icon > div')
              const icon = icons?.[icons.length - 1]
              if (icon) icon.style.transform = 'scale(1)'
            })

            if (i > 0) {
              const arc = curvedArc(stops[i - 1].coords, stop.coords)
              const line = L.polyline(arc, {
                color: '#b45309', weight: 2, dashArray: '6 4', opacity: 0.7,
              }).addTo(map!)
              layers.push(line)
            }
          }, i * DELAY)
          // Store timer ref for cleanup via layers array trick — not needed since cancelled flag handles it
          void timers
        })

        // Loop: wait for all stops + pause, then restart
        loopTimer = setTimeout(() => animate(), stops.length * DELAY + PAUSE)
      }

      animate()
    })

    return () => {
      cancelled = true
      clearTimeout(loopTimer)
      map?.remove()
    }
  }, [itinerary])

  if (stops.length === 0) return null

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />
}
