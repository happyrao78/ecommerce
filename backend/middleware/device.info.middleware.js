import useragent from 'useragent';
import geoip from 'geoip-lite'; // You'd need to install this

const extractDeviceInfo = (req, res, next) => {
    const agent = useragent.parse(req.headers['user-agent']);
    
    // Get IP address (accounting for proxies)
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress;
    
    // Get geo location from IP
    const geo = geoip.lookup(ip);
    
    req.deviceInfo = {
        // Browser info
        browser: agent.toAgent() || 'Unknown',
        browserName: agent.family || 'Unknown',
        browserVersion: agent.major + '.' + agent.minor + '.' + agent.patch,
        
        // OS info
        os: agent.os ? agent.os.toString() : 'Unknown',
        osName: agent.os ? agent.os.family : 'Unknown',
        osVersion: agent.os ? agent.os.major + '.' + agent.os.minor + '.' + agent.os.patch : 'Unknown',
        
        // Device info
        platform: agent.platform ? agent.platform.toString() : 'Unknown',
        device: agent.device ? agent.device.toString() : 'Unknown',
        deviceType: agent.device ? agent.device.family : 'Unknown',
        isMobile: agent.device ? agent.device.family !== 'Other' : false,
        
        // Request info
        ip: ip,
        language: req.headers['accept-language'] || 'Unknown',
        referrer: req.headers['referer'] || 'Direct',
        timestamp: new Date().toISOString(),
        
        // Location data if available
        location: geo ? {
            country: geo.country,
            region: geo.region,
            city: geo.city,
            timezone: geo.timezone,
            ll: geo.ll // latitude/longitude
        } : null
    };
    
    console.log(req.deviceInfo);
    next();
};

export default extractDeviceInfo;