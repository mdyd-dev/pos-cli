module MarketplaceKit
  module Services
    class ApiDriver
      def initialize(request_type, url, hash_body, options)
        @request_type = request_type
        @url = url
        @hash_body = hash_body
        @options = options
      end

      def send_request
        url = "api/marketplace_builder/#{@url}"
        body = prepare_body_to_send

        response = connection.method(@request_type).call(url, body)
        parsed_response = JSON.parse(response.body)

        raise Errors::ApiError.new(parsed_response) unless response.success?
        OpenStruct.new(status: response.status, body: parsed_response, success?: true)
      rescue StandardError => e
        ApiErrorHandler.new(e, response).process
        OpenStruct.new(status: response&.status, body: parsed_response, success?: false)
      end

      protected

      def connection
        @options[:multipart] ? multipart_connection : json_connection
      end

      def prepare_body_to_send
        return @hash_body if @options[:multipart]

        body_should_be_json? ? @hash_body.to_json : @hash_body
      end

      def body_should_be_json?
        [:post, :put, :patch].include?(@request_type)
      end

      private

      def json_connection
        @json_connection ||= Faraday.new(basic_configuration.deeper_merge(headers: { 'Content-Type' => 'application/json' }))
      end

      def multipart_connection
        @multipart_connection ||= Faraday.new(basic_configuration) do |connection|
          connection.request :multipart
          connection.request :url_encoded
          connection.adapter :net_http
        end
      end

      def basic_configuration
        {
          url: MarketplaceKit.config.url,
          headers: {
            'UserTemporaryToken' => MarketplaceKit.config.token,
            'Accept' => 'application/vnd.nearme.v4+json'
          }
        }
      end
    end
  end
end
