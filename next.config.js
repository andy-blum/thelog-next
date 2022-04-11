module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'a.espncdn.com',
      'assets.nydailynews.com',
      'bp3.blogger.com',
      'g.espncdn.com',
      'image.shutterstock.com',
      'memberfiles.freewebs.com',
      'm.media-amazon.com',
      '0.media.collegehumor.cvcdn.com'
    ]
  },
  rewrites: async () => {
    return [
      {
        source: '/api/graphql',
        destination: 'https://api.log.football/api/graphql'
      }
    ]
  }
}
