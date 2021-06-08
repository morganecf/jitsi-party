#from flask import _app_ctx_stack

# s3 = FlaskS3()
# app = create_app('the-config.cfg')
# s3.init_app(app)

# each instance needs its own aws cli

import logging


class TestFactory(object):
    def __init__(self):
        print('tf-init')

    def init_app(self, app):
        logger = logging.getLogger(__name__)
        logger.info("init app")


# class TestFactory(object):
#     def __init__(self, app=None):
#         self.app = app
#         if app is not None:
#             self.init_app(app)

#     def init_app(self, app):
#         # app.config.setdefault('TestFactory', ':memory:')
#         # app.teardown_appcontext(self.teardown)
#         print('idk')

#     def test(self):
#         # return sqlite3.connect(current_app.config['SQLITE3_DATABASE'])
#         print("inside test factory")

#     # def teardown(self, exception):
#     #     ctx = _app_ctx_stack.top
#     #     if hasattr(ctx, 'testfactory'):
#     #         ctx.sqlite3_db.close()

#     # @property
#     # def connection(self):
#     #     ctx = _app_ctx_stack.top
#     #     if ctx is not None:
#     #         if not hasattr(ctx, 'testfactory'):
#     #             ctx.testfactory = self.connect()
#     #         return ctx.testfactory
